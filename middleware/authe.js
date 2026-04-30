
const jwt = require("jsonwebtoken");
const chatusers = require("../models/chatusers");


async function verifyToken(req, res, next) {
   
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const decode = jwt.verify(token, "secretkey");

    const user = await chatusers.findByPk(decode.userId);
    // console.log("USER: from middleware auth", user);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    req.user = user;   
    next();

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Invalid token" });
  }
}

module.exports = verifyToken;