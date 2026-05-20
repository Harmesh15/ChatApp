module.exports = (socket, io) => {

  // CREATE GROUP
  socket.on("create-group", ({ groupId, groupName }) => {

    socket.join(groupId);

    console.log("Group created:", groupId);
    // 🔥 correct syntax
    io.emit("new-group", {
      groupId,
      groupName
    });
  });

  // JOIN GROUP
  socket.on("join-group", (groupId) => {
    socket.join(groupId);
    console.log("User joined group:", groupId);
  });

  // SEND MESSAGE
  socket.on("group-message", ({ groupId, message, mediaUrl,type}) => {

    const data = {
      message,
      userId: socket.user.id,
      name: socket.user.name,
      mediaUrl:mediaUrl,
      type:type
    };

    io.to(groupId).emit("group-message", data);
  });
};