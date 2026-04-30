const { messages, chatusers } = require("../models");

const loadmessage = async (req, res) => {
  try {
    const response = await messages.findAll({
      attributes: ['id', 'message', 'userId', 'createdAt'],
      include: [
        {
          model: chatusers,
          attributes: ['name'],
          required: true
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json({ success: true, response });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching messages"
    });
  }
};



 async function messageReceive (req,res){

    console.log("message receive con hit");
       try{
        const {message} = req.body;

         const response = await messages.create({
            message:message,
            userId: req.user.id,      
         })
        res.status(200).json({success:true,response});
       }catch(error){
        console.log(error);
       }
}


const loadUsers = async (req,res)=>{
  try{
    console.log("loaduser api hit");
    const response = await chatusers.findAll();

    res.status(200).json({message:"all users",response});

  }catch(error){
    res.status(400).json({message:"Something got wrong",error});
    console.log(error)
  }
}



const searchUser = async (req,res)=>{
  try{
    const user = await chatusers.findOne({ where: { email: req.query.email } });
     
    if (!user) {
   return res.status(404).json({ message: "User not found" });
}

    res.json(user);
        }catch(error){
          console.log(error);
        res.status(400).json({message:"something is wrong"});
    }
  }


// load Messages;
  
// async function loadmessage (req,res){
//     console.log("message  load api hit");
//      try{
//         const response = await messages.findAll({
//          include: [
//             {
//         model:chatusers,
//         attributes:['message','userId','createdAt','name'],
//         order: [['createdAt',"ASC"]]
//          }]
//        }
//     );

//     res.status(200).json({success:true,response});
//      }catch(error){
//         console.log(error)
//         res.status(500).json({success:false,message:"massage load ni ho paye"})
//      }
// }


// async function loadmessage(req, res) {
//   console.log("message load api hit");

//   try {
//     const response = await messages.findAll({
//   attributes: ['id', 'message', 'userId', 'createdAt'],
//   include: [
//     {
//       model: chatusers,
//       as: 'user', // 👈 MUST (same alias)
//       attributes: ['id', 'name']
//     }
//   ],
//   order: [['createdAt', 'ASC']]
// });
//   res.status(200).json({success:true,response});
//   }catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "message load nahi ho paye"
//     });
//   }
// }




module.exports = {
    messageReceive,
    loadmessage,
    loadUsers,
    searchUser
}