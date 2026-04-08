const jwt = require('jsonwebtoken');

const AuthorizationToken =  async (req,res,next)=>{
     console.log('middleware hit')

const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(" ")[1]; // for barear

if(!token){
   return res.status(404).json({message:"Access token misssing"});
}

jwt.verify(token,"secretkey",(err,user)=>{
    if(err){
       return res.status(403).json({message:"Invalid or token expired"});
    }

    console.log("middleware finish his work");
    req.user = user;
    next();
})
};

module.exports = AuthorizationToken;