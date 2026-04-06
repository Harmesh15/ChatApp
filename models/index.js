const chatusers = require("./userChat");
const messages = require("./messages");

chatusers.hasMany(messages, { foreignKey: "userId" })
messages.belongsTo(chatusers, { foreignKey: "userId" });


module.exports = { chatusers,messages};