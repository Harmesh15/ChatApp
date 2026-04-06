const messages = require("../models/messages");


 async function messageReceive (req,res){
    console.log("message file hit");
      
       try{
        const {message} = req.body;
        
        console.log(req.params.userId);
         const response = await messages.create({
            message:message,
            userId:req.user.userId,
          
         })
         console.log(response);
       }catch(error){
        console.log(error);
       }
}

module.exports = {
    messageReceive,
}