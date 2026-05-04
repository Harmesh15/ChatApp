// module.exports = (socket,io)=>{

//  socket.on("join-room", (roomName)=>{
//    socket.join(roomName)
//    console.log("JOIN ROOM:", roomName);
//  })

//  socket.on("message", (msg) => {
   
//    const {roomName} = msg;

//      const data = {
//         message: msg,
//         userId: socket.user.id,
//         name: socket.user.name
//     };

//     io.to(roomName).emit("message", data);
//  });
// }


module.exports = (socket, io) => {

  socket.on("join-room", (roomName) => {
    socket.join(roomName);
    console.log("JOIN ROOM:", roomName);
    socket.emit("room-joined", roomName);
  });

  socket.on("message", (msg) => {

    const { roomName, message } = msg;

    const data = {
      message: message,   // ✅ sirf string
      userId: socket.user.id,
      name: socket.user.name
    };

    console.log(data,"ye personal chat ka hai");

    if (roomName) {
      io.to(roomName).emit("message", data); // ✅ personal chat
    } else {
      io.emit("message", data);
    }
  });
};