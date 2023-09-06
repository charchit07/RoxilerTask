const express = require("express");
const cors = require("cors")
const { connection } = require("./Config/db");
const { transactionRouter } = require("./Router/Transtion.Router");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/", transactionRouter);

app.listen(7500, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log(" Cannot Connected to DB");
    console.log(error);
  }
  console.log("Running the server at port 7500");
});
