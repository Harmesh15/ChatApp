const express = require("express");
const app = express();
const sequelize = require("./utils/db-connection"); 
const path = require("path");
const userRouter = require("./routes/loginSignupRot");
const messageRoute = require("./routes/messagesRot");
const cors = require("cors");


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.send("server is running")
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login/login.html'));
});

app.get("/signup",(req,res)=>{
    res.sendFile(path.join(__dirname, 'public/signup/signup.html'))
})


// app.get("/home",(req,res)=>{
//     res.sendFile(path.join(__dirname, 'public/home/home.html'))
// })

app.use("/user",userRouter);
app.use("/message",messageRoute);

const PORT = 8000;
sequelize.sync({alter:true})
.then(()=>{
    console.log("DB synced");
    app.listen(PORT,()=>{
 console.log(`server is running on Port no ${PORT}`);
})
})

