const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { User, Session } = require("../models");
const { SECRET } = require("../util/config");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  const passwordCorrect =
    user && (await bcrypt.compare(password, user.passwordHash));

  if (!passwordCorrect)
    return res.status(401).json({ error: "invalid credentials" });
  if (user.disabled) return res.status(401).json({ error: "account disabled" });

  const token = jwt.sign({ id: user.id }, SECRET);

  await Session.create({ token, userId: user.id });

  res.json({ token, username: user.username, name: user.name, id: user.id });
});

module.exports = router;
