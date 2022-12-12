const jwt = require("jsonwebtoken");
exports.authentication = (req, res, next) => {
  const AHeader = req.headers.authorization;

  try {
    const bearer = AHeader.split(" ");
    const token = bearer[1];
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (verified) {
      req.user = verified;
      next();
    } else {
      return res.status(401).send(error);
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};
