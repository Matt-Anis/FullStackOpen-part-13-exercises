const router = require("express").Router();

const { Blog, User, ReadingList, Session } = require("../models");

router.post("/", async (req, res) => {
  try {
    await Session.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
    await ReadingList.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
    await Blog.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
    await User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
    res.status(200).end();
  } catch (error) {
    console.log("DEBUG: Error resetting database:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
