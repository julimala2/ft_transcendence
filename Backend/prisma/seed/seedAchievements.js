// Importe le catalogue des badges depuis prisma/achievements.json.
// Lancement : npx prisma db seed, après seedQuestions.js (voir la config "seed" dans package.json) :
// les catégories et les tags référencés par les badges doivent déjà exister en base.
//
// Le script peut être relancé sans risque : chaque badge est retrouvé par son "slug".
// Tout est vérifié avant d'écrire quoi que ce soit en base.
// Un badge retiré du fichier n'est jamais supprimé : le Cascade effacerait aussi les badges obtenus par les joueurs.

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const FILE = path.join(__dirname, "achievements.json");

const METRICS = ["rush_score", "perfect_game", "games_finished"];
const DIFFICULTIES = [1, 2, 3];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// ---------- Vérification ----------

function isPositiveInt(value) {
  return Number.isInteger(value) && value > 0;
}

function checkAchievement(b, where, errors) {
  if (typeof b.slug !== "string" || !SLUG.test(b.slug)) {
    errors.push(`${where} : "slug" est requis (minuscules, sans accent ni espace)`);
  }
  if (typeof b.name !== "string" || b.name.trim() === "") {
    errors.push(`${where} : "name" est requis`);
  }
  if (typeof b.description !== "string" || b.description.trim() === "") {
    errors.push(`${where} : "description" est requis`);
  }
  if (!METRICS.includes(b.metric)) {
    errors.push(`${where} : "metric" doit valoir ${METRICS.join(", ")}`);
  }
  if (b.threshold !== undefined && !isPositiveInt(b.threshold)) {
    errors.push(`${where} : "threshold" doit être un entier positif`);
  }
  if (b.minQuestions !== undefined && !isPositiveInt(b.minQuestions)) {
    errors.push(`${where} : "minQuestions" doit être un entier positif`);
  }
  if (b.difficulty !== undefined && !DIFFICULTIES.includes(b.difficulty)) {
    errors.push(`${where} : "difficulty" doit valoir 1, 2 ou 3`);
  }
  if (typeof b.category !== "string" || b.category.trim() === "") {
    errors.push(`${where} : "category" est requis (slug de la catégorie)`);
  }
  if (b.icon !== undefined && b.icon !== null && typeof b.icon !== "string") {
    errors.push(`${where} : "icon" doit être un nom de fichier ou null`);
  }
}

// Vérifie le fichier et remplace les slugs de catégorie/tag par leurs id.
// Renvoie la liste prête à écrire, ou les erreurs.
async function loadAchievements() {
  const errors = [];

  let data;
  try {
    data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch (err) {
    return { errors: [`achievements.json : JSON invalide ou introuvable (${err.message})`] };
  }
  if (!Array.isArray(data.achievements)) {
    return { errors: [`achievements.json : "achievements" doit être un tableau`] };
  }

  const slugs = new Set();
  const ready = [];

  for (const [i, b] of data.achievements.entries()) {
    const where = `badge ${i + 1}${b.slug ? ` (${b.slug})` : ""}`;
    checkAchievement(b, where, errors);

    if (slugs.has(b.slug)) errors.push(`${where} : slug "${b.slug}" en double`);
    slugs.add(b.slug);

    const category = b.category
      ? await prisma.category.findUnique({ where: { slug: b.category } })
      : null;
    if (b.category && !category) {
      errors.push(`${where} : catégorie "${b.category}" inconnue (le seed des questions a-t-il tourné ?)`);
    }

    // Pas d'upsert : un tag absent de la base n'a aucune question, le badge serait impossible à obtenir
    const tag = b.tag ? await prisma.tag.findUnique({ where: { slug: b.tag } }) : null;
    if (b.tag && !tag) {
      errors.push(`${where} : tag "${b.tag}" inconnu (aucune question ne l'utilise)`);
    }

    if (category && (!b.tag || tag)) {
      ready.push({
        slug: b.slug,
        // null explicite : un champ retiré du fichier doit aussi être vidé en base
        fields: {
          name: b.name,
          description: b.description,
          icon: b.icon ?? null,
          metric: b.metric,
          threshold: b.threshold ?? 1,
          minQuestions: b.minQuestions ?? null,
          difficulty: b.difficulty ?? null,
          categoryId: category.id,
          tagId: tag ? tag.id : null,
        },
      });
    }
  }

  return { errors, achievements: ready, slugs };
}


async function main() {
  console.log("Import des badges...\n");

  const { errors, achievements, slugs } = await loadAchievements();
  if (errors.length > 0) {
    console.error(`${errors.length} erreur(s), aucun badge n'a été importé :\n`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exitCode = 1;
    return;
  }

  let created = 0;
  let updated = 0;

  for (const { slug, fields } of achievements) {
    const existing = await prisma.achievement.findUnique({ where: { slug }, select: { id: true } });
    await prisma.achievement.upsert({
      where: { slug },
      update: fields,
      create: { slug, ...fields },
    });
    if (existing) updated++;
    else created++;
  }

  // Badges en base mais plus dans le fichier : on les signale sans les supprimer.
  const inDb = await prisma.achievement.findMany({ select: { slug: true } });
  const orphans = inDb.filter((a) => !slugs.has(a.slug));

  console.log(`Terminé : ${created} badge(s) créé(s), ${updated} mis à jour.`);
  if (orphans.length > 0) {
    console.log(
      `Attention : ${orphans.length} badge(s) en base ne sont plus dans le fichier ` +
        `(${orphans.map((o) => o.slug).join(", ")}). Ils sont conservés pour ne pas retirer les badges déjà obtenus.`
    );
  }
}

main()
  .catch((err) => {
    console.error("\nErreur pendant l'import des badges :", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
