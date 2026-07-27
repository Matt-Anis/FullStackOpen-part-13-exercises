const express = require("express");
const app = express();

const { PORT, TESTING } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/authors");

const errorHandler = (error, req, res, next) => {
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).end();
});
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorRouter);

app.use(errorHandler);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

if (TESTING) {
  const resetRouter = require("./controllers/reset");
  app.use("/api/reset", resetRouter);
}

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
