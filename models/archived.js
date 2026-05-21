const sequelize = require("../utils/db-connection");
const {DataTypes} = require('sequelize');

const archivedChats = sequelize.define('archivedChats',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    message:{
        type:DataTypes.STRING,
    },
    roomName:{
        type:DataTypes.STRING
    },
    userId:{
        type:DataTypes.STRING
    },
    mediaUrl:{
        type:DataTypes.STRING
    },
    type:{
        type:DataTypes.STRING
    }
});

module.exports = archivedChats;
