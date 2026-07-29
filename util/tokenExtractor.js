const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");
const { Session, User } = require("../models");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7);
    const session = await Session.findOne({ where: { token } });
    if (!session) return res.status(401).json({ error: "session expired" });

    const decodedToken = jwt.verify(token, process.env.SECRET);
    console.log("DEBUG: decodedToken:", decodedToken);
    const user = await User.findByPk(decodedToken.id);
    if (user.disabled)
      return res.status(401).json({ error: "account disabled" });

    req.user = user;
    req.decodedToken = decodedToken;
  }
  next();
};

module.exports = tokenExtractor;
