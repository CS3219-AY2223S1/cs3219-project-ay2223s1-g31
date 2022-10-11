const express = require("express");
const QBank = require("../models/question-model");
const {
  createQ,
  getEQ,
  getMQ,
  getHQ,
} = require("../controller/question-controller");

const router = express.Router();

router.get("/ping", (_, res) =>
  res.json({ message: "Hello World from question-service" })
);

// get ez question
router.get("/easy", getEQ);

// get medium question
router.get("/medium", getMQ);

// get hard question
router.get("/hard", getHQ);

// post question
router.post("/", createQ);

module.exports = router;
