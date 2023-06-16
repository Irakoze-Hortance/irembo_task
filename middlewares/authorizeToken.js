const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req, res, next) => {
  if (!req.user || !req.user.token) {
    return res.status(403).send("A token is required for authentication");
  }

  const userToken = req.user.token;

  try {
    const decoded = jwt.verify(userToken, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

module.exports = verifyToken;
