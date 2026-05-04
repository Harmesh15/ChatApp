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
  socket.on("group-message", ({ groupId, message }) => {

    const data = {
      message,
      userId: socket.user.id,
      name: socket.user.name
    };

    io.to(groupId).emit("group-message", data);
  });
};