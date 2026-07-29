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

router.put("/:id", async (req, res) => {
  try {
    const { state } = req.body;
    const readingListEntry = await ReadingList.findByPk(req.params.id);
    if (!readingListEntry) {
      return res.status(404).json({ error: "Reading list entry not found" });
    }
    readingListEntry.state = state;
    await readingListEntry.save();
    res.json(readingListEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
