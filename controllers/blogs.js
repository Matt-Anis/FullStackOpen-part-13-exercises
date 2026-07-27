const router = require("express").Router();

const { Blog } = require("../models");
const tokenExtractor = require("../util/tokenExtractor");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  return res.json(blogs);
});

router.get("/:id", blogFinder, (req, res) => {
  res.json(req.blog);
});

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      userId: req.decodedToken.id,
    });
    return res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.put("/:id/like", blogFinder, async (req, res, next) => {
  try {
    req.blog.likes += 1;
    await req.blog.save();
    res.send(req.blog);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res) => {
  const deletedCount = await Blog.destroy({
    where: { id: req.params.id },
  });
  if (deletedCount === 1) {
    res.status(204).end();
  }
});

module.exports = router;
