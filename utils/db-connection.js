const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('expensetracker','root','harmesh15',{
    host:'localhost',
    dialect:'mysql',
});

(async ()=>{
    try{
        await sequelize.authenticate()
        console.log("connection completed");

        await sequelize.sync();
        console.log("All models were synchronized");
    }
    catch(error){
     console.log("DB connection failed", error);
}  
})()

module.exports = sequelize;