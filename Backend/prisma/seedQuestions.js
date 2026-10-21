// Importe la banque de questions depuis prisma/data/*.json (un fichier par catégorie).
// Lancement : npx prisma db seed (voir la config "seed" dans package.json)
//
// Le script peut être relancé sans risque : chaque question est retrouvée par sa "ref",
// chaque catégorie par son "slug", chaque image par son "src" et chaque tag par son slug.
// Tous les fichiers sont vérifiés avant d'écrire quoi que ce soit en base.

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const DATA_DIR = path.join(__dirname, "data");
const IMAGES_DIR = path.join(__dirname, "..", "assets", "quiz");

const TYPES = { multiple: 4, boolean: 2 }; // type -> nombre de réponses attendu
const DIFFICULTIES = [1, 2, 3];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// ---------- Vérification ----------

function checkImage(image, where, errors) {
  if (typeof image !== "object" || image === null) {
    errors.push(`${where} : "image" doit être un objet { src, alt }`);
    return;
  }
  if (typeof image.src !== "string" || image.src.trim() === "") {
    errors.push(`${where} : "image.src" est requis`);
  } else if (!fs.existsSync(path.join(IMAGES_DIR, image.src))) {
    errors.push(`${where} : image introuvable dans assets/quiz/${image.src}`);
  }
  if (typeof image.alt !== "string" || image.alt.trim() === "") {
    errors.push(`${where} : "image.alt" est requis (accessibilité)`);
  }
}

function checkQuestion(q, where, errors) {
  if (typeof q.ref !== "string" || q.ref.trim() === "") {
    errors.push(`${where} : "ref" est requis`);
  }
  if (!(q.type in TYPES)) {
    errors.push(`${where} : "type" doit valoir ${Object.keys(TYPES).join(" ou ")}`);
  }
  if (!DIFFICULTIES.includes(q.difficulty)) {
    errors.push(`${where} : "difficulty" doit valoir 1, 2 ou 3`);
  }
  if (typeof q.text !== "string" || q.text.trim() === "") {
    errors.push(`${where} : "text" est requis`);
  }
  if (q.tags !== undefined) {
    if (!Array.isArray(q.tags)) {
      errors.push(`${where} : "tags" doit être un tableau, ex. ["capitale", "afrique"]`);
    } else {
      for (const tag of q.tags) {
        if (typeof tag !== "string" || !SLUG.test(tag)) {
          errors.push(`${where} : tag "${tag}" invalide (minuscules, sans accent ni espace)`);
        }
      }
    }
  }
  if (q.image !== undefined) checkImage(q.image, where, errors);

  if (!Array.isArray(q.answers)) {
    errors.push(`${where} : "answers" doit être un tableau`);
    return;
  }
  const expected = TYPES[q.type];
  if (expected && q.answers.length !== expected) {
    errors.push(`${where} : une question "${q.type}" doit avoir ${expected} réponses (${q.answers.length} trouvées)`);
  }
  const correct = q.answers.filter((a) => a.isCorrect === true).length;
  if (correct !== 1) {
    errors.push(`${where} : il faut exactement une bonne réponse (${correct} trouvées)`);
  }
  q.answers.forEach((a, i) => {
    const answerWhere = `${where}, réponse ${i + 1}`;
    if (typeof a.isCorrect !== "boolean") {
      errors.push(`${answerWhere} : "isCorrect" doit valoir true ou false`);
    }
    const hasText = typeof a.text === "string" && a.text.trim() !== "";
    if (!hasText && a.image === undefined) {
      errors.push(`${answerWhere} : il faut un "text" ou une "image"`);
    }
    if (a.image !== undefined) checkImage(a.image, answerWhere, errors);
  });
}

function loadFiles() {
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const errors = [];
  const refs = new Map(); // ref -> fichier, pour détecter les doublons entre fichiers
  const categories = [];

  for (const file of files) {
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8"));
    } catch (err) {
      errors.push(`${file} : JSON invalide (${err.message})`);
      continue;
    }

    const cat = data.category || {};
    if (typeof cat.slug !== "string" || !SLUG.test(cat.slug)) {
      errors.push(`${file} : "category.slug" est requis (minuscules, sans accent ni espace)`);
    }
    if (typeof cat.name !== "string" || cat.name.trim() === "") {
      errors.push(`${file} : "category.name" est requis`);
    }
    if (!Array.isArray(data.questions)) {
      errors.push(`${file} : "questions" doit être un tableau`);
      continue;
    }

    data.questions.forEach((q, i) => {
      const where = `${file}, question ${i + 1}${q.ref ? ` (${q.ref})` : ""}`;
      checkQuestion(q, where, errors);
      if (typeof q.ref === "string") {
        if (refs.has(q.ref)) {
          errors.push(`${where} : ref "${q.ref}" déjà utilisée dans ${refs.get(q.ref)}`);
        }
        refs.set(q.ref, file);
      }
    });

    categories.push({ file, category: cat, questions: data.questions });
  }

  return { files, categories, errors, refs };
}

// ---------- Écriture en base ----------

async function upsertImage(tx, image) {
  if (!image) return null;
  const data = {
    alt: image.alt,
    creditAuthor: image.credit?.author ?? null,
    creditLicense: image.credit?.license ?? null,
    creditUrl: image.credit?.url ?? null,
  };
  const saved = await tx.image.upsert({
    where: { src: image.src },
    update: data,
    create: { src: image.src, ...data },
  });
  return saved.id;
}

// Compare les réponses en base avec celles du fichier, pour ne les recréer que si elles ont changé
// (les recréer casserait le lien avec les réponses déjà données par les joueurs).
function sameAnswers(existing, wanted) {
  if (existing.length !== wanted.length) return false;
  return existing.every(
    (a, i) =>
      a.text === wanted[i].text &&
      a.isCorrect === wanted[i].isCorrect &&
      a.imageId === wanted[i].imageId
  );
}

async function saveQuestion(q, categoryId) {
  return prisma.$transaction(async (tx) => {
    const imageId = await upsertImage(tx, q.image);

    const tagIds = [];
    for (const slug of q.tags || []) {
      const tag = await tx.tag.upsert({ where: { slug }, update: {}, create: { slug } });
      tagIds.push({ id: tag.id });
    }

    const answers = [];
    for (const a of q.answers) {
      answers.push({
        text: a.text ?? null,
        isCorrect: a.isCorrect,
        imageId: await upsertImage(tx, a.image),
      });
    }

    const fields = {
      type: q.type,
      difficulty: q.difficulty,
      text: q.text,
      explanation: q.explanation ?? null,
      categoryId,
      imageId,
      authorId: null, // banque officielle
    };

    const existing = await tx.question.findUnique({
      where: { ref: q.ref },
      include: { answers: { orderBy: { id: "asc" } } },
    });

    if (!existing) {
      await tx.question.create({
        data: { ref: q.ref, ...fields, tags: { connect: tagIds }, answers: { create: answers } },
      });
      return "created";
    }

    await tx.question.update({
      where: { id: existing.id },
      data: { ...fields, tags: { set: tagIds } },
    });
    if (!sameAnswers(existing.answers, answers)) {
      await tx.answer.deleteMany({ where: { questionId: existing.id } });
      await tx.answer.createMany({
        data: answers.map((a) => ({ ...a, questionId: existing.id })),
      });
    }
    return "updated";
  });
}

async function main() {
  console.log("Import de la banque de questions...\n");

  const { files, categories, errors, refs } = loadFiles();
  if (files.length === 0) {
    console.log("Aucun fichier JSON trouvé dans prisma/data/");
    return;
  }
  if (errors.length > 0) {
    console.error(`${errors.length} erreur(s), rien n'a été importé :\n`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exitCode = 1;
    return;
  }

  let created = 0;
  let updated = 0;

  for (const { file, category, questions } of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: { slug: category.slug, name: category.name },
    });
    console.log(`${file} -> catégorie "${cat.name}" : ${questions.length} questions`);

    for (const q of questions) {
      const result = await saveQuestion(q, cat.id);
      if (result === "created") created++;
      else updated++;
    }
  }

  // Questions de la banque présentes en base mais plus dans aucun fichier : on les signale sans les supprimer.
  // Comparaison faite en JS : un notIn avec plus de 999 refs dépasse la limite de paramètres de SQLite.
  const bankRefs = await prisma.question.findMany({
    where: { authorId: null, ref: { not: null } },
    select: { ref: true },
  });
  const orphans = bankRefs.filter((q) => !refs.has(q.ref));

  console.log(`\nTerminé : ${created} question(s) créée(s), ${updated} mise(s) à jour.`);
  if (orphans.length > 0) {
    console.log(
      `Attention : ${orphans.length} question(s) en base ne sont plus dans aucun fichier ` +
        `(${orphans.map((o) => o.ref).join(", ")}). Passez-les en isActive = false si besoin.`
    );
  }
}

main()
  .catch((err) => {
    console.error("\nErreur pendant l'import :", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
