const sequelize = require("../utils/db-connection");
const { DataTypes } = require("sequelize");

const chatusers = sequelize.define('chatusers', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false, 
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:false,
    }
})

module.exports = chatusers;
