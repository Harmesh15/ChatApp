const express = require("express");
const http = require("http");
const sequelize = require("./utils/db-connection"); 
// const {Server} = require("socket.io");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
// const chatusers = require("./models/chatusers");s  


const socketIo = require("./socket_io/index")


const userRouter = require("./routes/loginSignupRot");
const messageRoute = require("./routes/messagesRot");




const app = express();
const server = http.createServer(app);
socketIo(server);


// ================== MIDDLEWARE ==================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// ================== ROUTES ==================
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, 'public/home/home.html'));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login/login.html'));
});

app.get("/signup",(req,res)=>{
    res.sendFile(path.join(__dirname, 'public/signup/signup.html'))
})


app.use("/message",messageRoute);
app.use("/user",userRouter);


// ================== SERVER START ==================
const PORT = 8000;

sequelize.sync({ alter:false })
.then(() => {
    console.log("DB synced");
    server.listen(PORT, () => {
        console.log(`server is running on Port no ${PORT}`);
    });
})
.catch(err => {
    console.log("DB error:", err);
});