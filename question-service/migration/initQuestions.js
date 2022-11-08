const QBank = require("../models/question-model");
const questions = require("./qbanks.json");

async function initQuestions() {
  await QBank.create(questions);
  //   for (let i = 0; i < questions.length; i++) {
  //     console.log(questions[i].title);
  //     await QBank.create(questions[0]);
  //   }
}

// initQuestions();
module.exports = {
  initQuestions,
};
