const router = require("express").Router();
const { ReadingList } = require("../models");
const { Op } = require("sequelize");

router.post("/", async (req, res) => {
  try {
    const { userId, blogId } = req.body;
    const readingListEntry = await ReadingList.create({
      userId,
      blogId,
    });
    res.status(201).json(readingListEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
