const {Server} = require("socket.io");
const socketAuth = require("./middleware");
// const chathandler = require("./handler/chat");
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
    // chathandler(socket,io);
    personalchathandler(socket,io)
});


}