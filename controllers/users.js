const router = require("express").Router();
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const { User, Blog } = require("../models");
const tokenExtractor = require("../util/tokenExtractor");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["password_hash"] },
    include: {
      model: Blog,
    },
  });
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const throughWhere = {};
  if (req.query.read) {
    throughWhere.state = req.query.read === "true" ? "read" : "unread";
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["password_hash"] },
    include: [
      {
        model: Blog,
        attributes: { exclude: ["userId"] },
      },
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId"] },
        through: {
          attributes: ["id", "state"],
          where: Object.keys(throughWhere).length ? throughWhere : undefined,
        },
      },
    ],
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { password, username, name } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = User.build({ passwordHash, name, username });
    const result = await user.save();
    return res.status(201).json(result);
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
