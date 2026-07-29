const router = require("express").Router();
const { ReadingList } = require("../models");
const { Op } = require("sequelize");

const tokenExtractor = require("../util/tokenExtractor");

router.post("/", async (req, res) => {
  try {
    const { userId, blogId } = req.body;

    const existing = await ReadingList.findOne({ where: { userId, blogId } });
    if (existing) {
      return res.status(400).json({ error: "blog already in reading list" });
    }

    const readingListEntry = await ReadingList.create({ userId, blogId });
    res.status(201).json(readingListEntry);
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(404).json({ error: "user or blog not found" });
    }
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", tokenExtractor, async (req, res) => {
  if (!req.user)
    return res.status(401).json({ error: "authentication required" });
  try {
    const { state } = req.body;
    const readingListEntry = await ReadingList.findByPk(req.params.id);
    if (!readingListEntry) {
      return res.status(404).json({ error: "reading list entry not found" });
    }
    if (readingListEntry.userId !== req.user.id) {
      return res.status(401).json({ error: "not authorized" });
    }
    readingListEntry.state = state;
    await readingListEntry.save();
    res.json(readingListEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
