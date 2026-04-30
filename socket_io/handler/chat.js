module.exports = (socket,io)=>{
    socket.on("message",(msg)=>{
        
        const data = {
            message: msg.message,
            userId: socket.user.id,
            name: socket.user.name
        };

        io.emit("message", data);
    });
}