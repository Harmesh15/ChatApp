// const jwt = require('jsonwebtoken');

// const AuthorizationToken =  async (req,res,next)=>{
//      console.log('middleware hit')

// const authHeader = req.headers['authorization'];
// const token = authHeader && authHeader.split(" ")[1]; // for barear

// if(!token){
//    return res.status(404).json({message:"Access token misssing"});
// }

// jwt.verify(token,"secretkey",(err,user)=>{
//     if(err){
//        return res.status(403).json({message:"Invalid or token expired"});
//     }

//     console.log("middleware finish his work");
//     req.user = user;
//     next();
// })
// };

// module.exports = AuthorizationToken;


// const chatusers = require("../models/chatusers");

// async function verifyToken (req,res,next){
//    try{
//       const token = req.headers.authorization?.split(" ")[1];

//       if(!token){
//          return res.status(401).json({message:"Token is missing"});
//       }

//       const decode = chatusers.verifyToken(token);

//       if(!decode){
//          return res.status(401).json({message:"Invalid or expire token"});
//       }

//       // const user = await chatusers.findByPk(decode.userId);
//       const user = await chatusers.findByPk(decode.userId || decode.id);

//       if(!user){
//          return res.status(404).json({message:"user not found"});
//       }

//       req.user = user;
//       next();
//    }
//    catch(error){
//       return res.status(500).json({message:"Internal server error"});
//    }
// }

// module.exports = verifyToken;





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
    console.log("USER: from middleware auth", user);

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