// prisma/seed.mjs — importe les questions d'Open Trivia DB dans la base.
// Questions : Open Trivia Database (https://opentdb.com), licence CC BY-SA 4.0.
//
// Lancement : npx prisma db seed   (voir la config "seed" dans package.json)
// Le script peut être relancé sans risque : les questions déjà présentes sont ignorées.
// Durée : une dizaine de minutes, à cause de la limite d'OpenTDB (1 appel / 5 s).

import { createHash } from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const API = 'https://opentdb.com';
const DELAY_MS = 5500; // un peu plus que les 5 s exigées
const MAX_PER_CALL = 50;

// Valeurs autorisées (le schéma utilise des String, pas d'enum) :
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const TYPES = ['multiple', 'boolean'];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Avec encode=url3986, chaque texte arrive encodé façon URL (%20 etc.) :
// on décode pour retrouver les accents, guillemets, symboles...
const decode = (s) => decodeURIComponent(s);

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Toutes les requêtes passent par ici : on respecte le délai entre deux appels
// et on réessaie si l'API répond "trop de requêtes".
let lastCall = 0;
async function callApi(path) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const wait = lastCall + DELAY_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastCall = Date.now();

    const res = await fetch(`${API}${path}`);
    if (res.status === 429) {
      console.warn('  Trop de requêtes, nouvelle tentative...');
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} sur ${path}`);

    const data = await res.json();
    if (data.response_code === 5) {
      console.warn('  Limite de débit atteinte, nouvelle tentative...');
      continue;
    }
    return data;
  }
  throw new Error(`Échec après plusieurs tentatives : ${path}`);
}

// Insère une question et ses réponses. Renvoie false si elle existait déjà.
async function saveQuestion(q, categoryId) {
  if (!DIFFICULTIES.includes(q.difficulty) || !TYPES.includes(q.type)) {
    console.warn(`  Question ignorée (valeur inattendue : ${q.difficulty} / ${q.type})`);
    return false;
  }

  // OpenTDB ne fournit pas d'identifiant : on fabrique une empreinte stable.
  const sourceId = createHash('sha1').update(`${q.category}|${q.question}`).digest('hex');

  const exists = await prisma.question.findUnique({
    where: { source_sourceId: { source: 'opentdb', sourceId } },
    select: { id: true },
  });
  if (exists) return false;

  await prisma.question.create({
    data: {
      text: decode(q.question),
      type: q.type,
      difficulty: q.difficulty,
      source: 'opentdb',
      sourceId,
      categoryId,
      answers: {
        create: [
          { text: decode(q.correct_answer), isCorrect: true },
          ...q.incorrect_answers.map((a) => ({ text: decode(a), isCorrect: false })),
        ],
      },
    },
  });
  return true;
}

async function main() {
  // Le token garantit qu'OpenTDB ne nous renvoie jamais deux fois la même question.
  const { token } = await callApi('/api_token.php?command=request');
  const { trivia_categories } = await callApi('/api_category.php');

  let inserted = 0;
  let skipped = 0;

  for (const cat of trivia_categories) {
    const category = await prisma.category.upsert({
      where: { opentdbId: cat.id },
      update: {},
      create: { opentdbId: cat.id, name: cat.name, slug: slugify(cat.name) },
    });

    const count = await callApi(`/api_count.php?category=${cat.id}`);
    let remaining = count.category_question_count.total_question_count;
    console.log(`\n${cat.name} : ${remaining} questions`);

    while (remaining > 0) {
      const amount = Math.min(MAX_PER_CALL, remaining);
      const data = await callApi(
        `/api.php?amount=${amount}&category=${cat.id}&encode=url3986&token=${token}`
      );

      if (data.response_code === 4) break; // plus aucune question nouvelle ici
      if (data.response_code !== 0) {
        console.warn(`  Code ${data.response_code} reçu, on passe à la catégorie suivante`);
        break;
      }

      for (const q of data.results) {
        if (await saveQuestion(q, category.id)) inserted++;
        else skipped++;
      }
      remaining -= data.results.length;
      process.stdout.write(`  ${inserted} insérées au total\r`);
    }
  }

  console.log(`\n\nTerminé : ${inserted} questions insérées, ${skipped} déjà présentes.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
