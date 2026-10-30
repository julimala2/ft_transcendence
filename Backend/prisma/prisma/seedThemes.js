// Importe les thèmes d'affichage depuis prisma/themes.json.
// Lancement : npx prisma db seed, après seedQuestions.js (voir la config "seed" dans package.json) :
// les catégories rangées dans les thèmes doivent déjà exister en base.
//
// Le script peut être relancé sans risque : chaque thème est retrouvé par son "slug",
// et ses catégories sont remplacées par celles du fichier.
// Tout est vérifié avant d'écrire quoi que ce soit en base.

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const FILE = path.join(__dirname, "themes.json");
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// ---------- Vérification ----------

function checkTheme(theme, where, errors) {
  if (typeof theme.slug !== "string" || !SLUG.test(theme.slug)) {
    errors.push(`${where} : "slug" est requis (minuscules, sans accent ni espace)`);
  }
  if (typeof theme.name !== "string" || theme.name.trim() === "") {
    errors.push(`${where} : "name" est requis`);
  }
  if (theme.position !== undefined && !Number.isInteger(theme.position)) {
    errors.push(`${where} : "position" doit être un entier`);
  }
  if (!Array.isArray(theme.categories)) {
    errors.push(`${where} : "categories" doit être un tableau de slugs (vide si aucune catégorie)`);
  }
}

// Vérifie le fichier et remplace les slugs de catégories par leurs id.
// Renvoie la liste prête à écrire, ou les erreurs.
async function loadThemes() {
  const errors = [];

  let data;
  try {
    data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch (err) {
    return { errors: [`themes.json : JSON invalide ou introuvable (${err.message})`] };
  }
  if (!Array.isArray(data.themes)) {
    return { errors: [`themes.json : "themes" doit être un tableau`] };
  }

  const slugs = new Set();
  const names = new Set();
  const ready = [];

  for (let i = 0; i < data.themes.length; i++) {
    const theme = data.themes[i];
    let where = `thème ${i + 1}`;
    if (theme.slug) {
      where = `${where} (${theme.slug})`;
    }

    checkTheme(theme, where, errors);

    if (slugs.has(theme.slug)) {
      errors.push(`${where} : slug "${theme.slug}" en double`);
    }
    slugs.add(theme.slug);

    if (names.has(theme.name)) {
      errors.push(`${where} : nom "${theme.name}" en double`);
    }
    names.add(theme.name);

    if (!Array.isArray(theme.categories)) {
      continue;
    }

    // Slug de catégorie -> { id } (format attendu par Prisma pour relier les catégories)
    const categoryIds = [];
    for (const categorySlug of theme.categories) {
      const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (category === null) {
        errors.push(`${where} : catégorie "${categorySlug}" inconnue (le seed des questions a-t-il tourné ?)`);
      } else {
        categoryIds.push({ id: category.id });
      }
    }

    let position = 0;
    if (theme.position !== undefined) {
      position = theme.position;
    }

    ready.push({
      slug: theme.slug,
      name: theme.name,
      position: position,
      categoryIds: categoryIds,
    });
  }

  return { errors: errors, themes: ready, slugs: slugs };
}

// ---------- Écriture en base ----------

async function main() {
  console.log("Import des thèmes...\n");

  const { errors, themes, slugs } = await loadThemes();
  if (errors.length > 0) {
    console.error(`${errors.length} erreur(s), aucun thème n'a été importé :\n`);
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  for (const theme of themes) {
    await prisma.theme.upsert({
      where: { slug: theme.slug },
      // set : remplace les catégories du thème par exactement celles du fichier
      update: { name: theme.name, position: theme.position, categories: { set: theme.categoryIds } },
      create: { slug: theme.slug, name: theme.name, position: theme.position, categories: { connect: theme.categoryIds } },
    });
    console.log(`${theme.name} : ${theme.categoryIds.length} catégorie(s)`);
  }

  // Thèmes en base mais plus dans le fichier : on les signale sans les supprimer
  const inDb = await prisma.theme.findMany({ select: { slug: true } });
  const orphans = [];
  for (const theme of inDb) {
    if (!slugs.has(theme.slug)) {
      orphans.push(theme.slug);
    }
  }

  console.log(`\nTerminé : ${themes.length} thème(s) importé(s).`);
  if (orphans.length > 0) {
    console.log(`Attention : ${orphans.length} thème(s) en base ne sont plus dans le fichier (${orphans.join(", ")}).`);
  }
}

main()
  .catch(function (err) {
    console.error("\nErreur pendant l'import des thèmes :", err);
    process.exitCode = 1;
  })
  .finally(function () {
    return prisma.$disconnect();
  });
