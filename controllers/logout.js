const router = require("express").Router();
const { Session } = require("../models");

router.delete("/", async (req, res) => {
  const authorization = req.get("authorization");
  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "token missing" });
  }

  const token = authorization.substring(7);
  const session = await Session.findOne({ where: { token } });
  if (!session) {
    return res.status(401).json({ error: "invalid token" });
  }

  await session.destroy();
  res.status(204).end();
});

module.exports = router;
