const router = require("express").Router();
const bcrypt = require("bcrypt");

const { User, Blog } = require("../models");
const tokenExtractor = require("../util/tokenExtractor");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ["userId"],
      },
    },
    exclude: ["passwordHash"],
  });
  res.json(users);
});

router.post("/", async (req, res, next) => {
  try {
    const { password, username, name } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = User.build({ passwordHash, name, username });
    await user.save();
    return res.status(201).end();
  } catch (error) {
    next(error);
  }
});

router.put("/:username", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const newUsername = req.body.username;

    if (!newUsername) {
      return res.status(400).json({ error: "username missing" });
    } else if (newUsername === user.username) {
      return res
        .status(400)
        .json({ error: "cannot update to the current username" });
    }

    user.username = newUsername;
    await user.save();
    return res.status(200).end();
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
