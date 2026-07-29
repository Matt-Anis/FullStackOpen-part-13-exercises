const router = require("express").Router();
const { Session } = require("../models");

router.delete("/", async (req, res) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7);
    await Session.destroy({ where: { token } });
  }
  res.status(204).end();
});

module.exports = router;
