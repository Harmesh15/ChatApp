const cron = require("node-cron");

const {Op} = require("sequelize");
const message = require("../models/messages");
const archived = require("../models/archived");

cron.schedule("* * * * *", async ()=>{
    try{

        console.log("Running archive cron job");

        // const oneDayOld = new Date();

        // oneDayOld.setDate(oneDayOld.getDate() - 1);


         const oneMinuteOld = new Date(
             Date.now() - 1 * 60 * 1000
          );
        
                const oldChats = await message.findAll({

            where: {
                createdAt: {
                    [Op.lt]: oneMinuteOld
                }
            }

        });


        if(oldChats.length > 0){

            await archived.bulkCreate(
               oldChats.map(chat => ({
                message : chat.message,
                roomName: chat.roomName,
                userId:chat.userId,
                mediaUrl:chat.mediaUrl,
                type:chat.type,
                createdAt:chat.createdAt,
                updatedAt:chat.updatedAt
               }))
            );

            await message.destroy({
                where:{
                    createdAt:{
                        [Op.lt]:oneMinuteOld
                    }
                }
            });
             console.log("Chats archived successfully");
        }
    }catch(error){
        console.log(error)
    }
})