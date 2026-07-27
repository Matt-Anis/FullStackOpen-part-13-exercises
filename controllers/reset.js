const router = require("express").Router();

const { Blog, User } = require("../models");

router.post("/", async (req, res) => {
  await Blog.destroy({ truncate: true, cascade: true, restartIdentity: true });
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
  res.status(200).end();
});

module.exports = router;
