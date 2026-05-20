const chatusers = require("./chatusers");
const messages = require("./messages");

messages.belongsTo(chatusers, { foreignKey: 'userId'});
chatusers.hasMany(messages, { foreignKey: 'userId' });

module.exports = { chatusers,messages};



