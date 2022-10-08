const QBank = require("../models/question-model");

// get ez question
const getEQ = async (req, res) => {
  try {
    const q = await QBank.aggregate([
      { $match: { difficulty: "easy" } },
      { $sample: { size: 1 } },
    ]);
    return res.status(200).json(q[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Cannot get question!" });
  }
};

// get medium question
const getMQ = async (req, res) => {
  try {
    const q = await QBank.aggregate([
      { $match: { difficulty: "medium" } },
      { $sample: { size: 1 } },
    ]);
    return res.status(200).json(q[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Cannot get question!" });
  }
};

// get hard question
const getHQ = async (req, res) => {
  try {
    const q = await QBank.aggregate([
      { $match: { difficulty: "hard" } },
      { $sample: { size: 1 } },
    ]);
    return res.status(200).json(q[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Cannot get question!" });
  }
};

// create question
const createQ = async (req, res) => {
  try {
    const { title, difficulty, question, template, tags } = req.body;
    if (!title || !difficulty || !question) {
      return res.status(400).json({ message: "Missing fields!" });
    }
    const alreadyExists = await QBank.exists({ title });
    if (alreadyExists) {
      return res
        .status(400)
        .json({ message: "Question title already exists in the database!" });
    }
    const q = await QBank.create({
      title,
      difficulty,
      question,
      template,
      tags,
    });
    return res.status(200).json(q);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Cannot create question!" });
  }
};

module.exports = {
  getEQ,
  createQ,
  getMQ,
  getHQ,
};
