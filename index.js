const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");

const errorHandler = (error, req, res, next) => {
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(express.json());

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
