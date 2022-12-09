const jwt = require("jsonwebtoken");
// const jwtSecretKey = "SECRET_KEY";

exports.authentication = (req, res, next) => {
  const AHeader = req.headers.authorization;
  console.log("AHeader =>", AHeader);

  try {
    const bearer = AHeader.split(" ");
    const token = bearer[1];
    // let decoded = jwt.decode(token);
    // console.log("auth token => ", token);
    // console.log("auth  => ", decoded);
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("verified => ", verified);
    if (verified) {
      console.log("token is verified move on ===> ", verified);
      req.user = verified;

      next();
    } else {
      return res.status(401).send(error);
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};
