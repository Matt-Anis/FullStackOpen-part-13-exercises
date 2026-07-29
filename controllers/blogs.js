const router = require("express").Router();
const { Op } = require("sequelize");

const { Blog, User } = require("../models");
const tokenExtractor = require("../util/tokenExtractor");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id, {
    include: {
      model: User,
      attributes: {
        exclude: ["id", "passwordHash", "updatedAt", "createdAt", "userId"],
      },
    },
  });
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

router.get("/", async (req, res) => {
  const where = {};
  if (req.query.search) {
    where[Op.or] = {
      title: { [Op.iLike]: `%${req.query.search}%` },
      author: { [Op.iLike]: `%${req.query.search}%` },
    };
  }

  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: {
        exclude: ["id", "passwordHash", "updatedAt", "createdAt", "userId"],
      },
    },
    where,
    order: [["likes", "DESC"]],
  });
  return res.json(blogs);
});

router.get("/:id", blogFinder, (req, res) => {
  res.json(req.blog);
});

router.post("/", tokenExtractor, async (req, res, next) => {
  console.log("DEBUG: req.decodedToken:", req.decodedToken);
  try {
    const blog = await Blog.create({
      ...req.body,
      userId: req.decodedToken.id,
    });
    return res.json(blog);
  } catch (error) {
    console.error("DEBUG: Error creating blog:", error);
    next(error);
  }
});

router.put("/:id", blogFinder, async (req, res, next) => {
  const blog = req.blog;
  Object.assign(blog, req.body);
  await blog.save();
  res.json(blog);
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

router.delete("/:id", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) {
    return res.status(404).json({ error: "blog not found" });
  }
  if (blog.userId !== user.id) {
    return res.status(403).end();
  }

  await blog.destroy();
  res.status(204).end();
});

module.exports = router;
