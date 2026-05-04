const {Server} = require("socket.io");
const socketAuth = require("./middleware");
const groupChathandler = require("./handler/groupChat");
const personalchathandler = require("./handler/personalChat");

module.exports = (server)=> {
    const io = new Server(server,{
      cors: {
         origin: "*"
  }
});

socketAuth(io);


io.on('connection',(socket)=>{
    console.log("Connected:", socket.user.name);
    groupChathandler(socket,io);
    personalchathandler(socket,io)
});


}