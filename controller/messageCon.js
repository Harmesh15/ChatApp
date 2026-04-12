const messages = require("../models/messages");

 async function messageReceive (req,res){
    console.log("message receive con hit");
      
       try{
        const {message} = req.body;
        
        console.log(req.user.userId,);
         const response = await messages.create({
            message:message,
            userId:req.user.userId,
          
         })
        res.status(200).json({success:true,response});
       }catch(error){
        console.log(error);
       }
}


// load Messages;
  
async function loadmessage (req,res){
    console.log("message  load api hit");
     try{
        const response = await messages.findAll(
       {
        attributes:['message','userId','createdAt'],
        order: [['createdAt',"ASC"]]
       }
    );

    res.status(200).json({success:true,response});
     }catch(error){
        console.log(error)
        res.status(500).json({success:false,message:"massage load ni ho paye"})
     }
}

module.exports = {
    messageReceive,
    loadmessage
}