const express = require("express");
const cors = require("cors");
require("express-async-errors");
require("dotenv").config();
const pool = require("./db/connectDb");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const notFound = require("./error/not-found");
const errorHandler = require("./middleWare/errorHandler");

const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.get("/", (req, res) => res.send("Home Page"));

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await pool.connect();
    app.listen(port, () => console.log(`server is running on port : ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
