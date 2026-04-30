const chatusers = require("../models/chatusers");
const jwt = require("jsonwebtoken");

module.exports = (io)=>{

    io.use( async (socket, next) => {
  console.log("middlw ware backend run")
  try{
        const token = socket.handshake.auth.token;

        if(!token){
         return next(new Error("Token is missing"));
      }
    const decode = jwt.verify(token, "secretkey"); 
    const user = await chatusers.findByPk(decode.userId);
      if(!user){
         return next( new Error("user not found"));
      }
      socket.user = user;
      next();
   }catch(error){
    console.log("SOCKET ERROR:", error);
         return next( new Error("Internal server error"));
  }
});

}