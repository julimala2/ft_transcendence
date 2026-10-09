const prisma = require('../lib/prisma');
const fs = require("fs");
const path = require("path");


async function seedQuiz(data) {
  console.log(`\nImport du quiz : ${data.quiz.title}`);

  const category = await prisma.category.upsert({
    where: {
      name: data.category.name,
    },
    update: {},
    create: {
      name: data.category.name,
    },
  });

  console.log(`Catégorie : ${category.name}`);

  const quiz = await prisma.quiz.create({
    data: {
      title: data.quiz.title,
      description: data.quiz.description,
    },
  });

  console.log(`Quiz créé : ${quiz.title}`);

  for (const questionData of data.questions) {
    await prisma.question.create({
      data: {
        text: questionData.text,
        difficulty: questionData.difficulty,

        quizId: quiz.id,
        categoryId: category.id,

        answers: {
          create: questionData.answers,
        },
      },
    });
  }

  console.log(`   ${data.questions.length} questions créées`);
}

async function main() {
  console.log("Début du seeding...\n");

  const dataDirectory = path.join(__dirname, "data");

  const files = fs
    .readdirSync(dataDirectory)
    .filter((file) => file.endsWith(".json"));

  if (files.length === 0) {
    console.log("Aucun fichier JSON trouvé dans prisma/data/");
    return;
  }

  console.log(`${files.length} fichier(s) trouvé(s)`);

  for (const file of files) {
    const filePath = path.join(dataDirectory, file);

    console.log(`\nLecture de ${file}`);

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    await seedQuiz(data);
  }

  console.log("\nSeeding terminé !");
}

main()
  .catch((error) => {
    console.error("\nErreur pendant le seeding :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
