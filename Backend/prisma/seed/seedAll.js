// Point d'entrée unique des seeds : lance les trois scripts dans l'ordre.
// Prisma exécute la commande "seed" de package.json sans shell, une chaîne
// "a && b && c" ne ferait tourner que le premier script.
// Ordre important : les thèmes rattachent des catégories créées par seedQuestions.

const { spawnSync } = require("child_process");
const path = require("path");

const scripts = ["seedQuestions.js", "seedThemes.js", "seedAchievements.js"];

for (const script of scripts) {
  const result = spawnSync(process.execPath, [path.join(__dirname, script)], {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
  }
}
