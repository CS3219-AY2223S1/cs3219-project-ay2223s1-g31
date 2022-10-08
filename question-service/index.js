require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const qRoutes = require("./routes/question-routes");

const FRONTEND_ORIGIN = "http://localhost:3000";
const PORT = process.env.PORT || 8051;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(morgan("dev"));

app.use("/api/question", qRoutes).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

// connect db
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connected to db and listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
