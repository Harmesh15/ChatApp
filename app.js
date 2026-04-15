const express = require("express");
const http = require("http");
const sequelize = require("./utils/db-connection"); 
const path = require("path");
const cors = require("cors");

const userRouter = require("./routes/loginSignupRot");
const messageRoute = require("./routes/messagesRot");


const app = express();
const server = http.createServer(app);

// const io = new Server(server); 

//
const socketIo = require("./socket_io/index");

// ================== MIDDLEWARE ==================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
 
 // ================== SOCKET ================== AUth============
socketIo(server)

//  io.on('connection',(socket)=>{
//     socket.on("send_message",(messages)=>{
//         io.emit("message",messages)
//         console.log("A new user message",messages);
//     });
//     console.log("connectedd");
//  });

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

app.use("/user",userRouter);
app.use("/message",messageRoute);

// ================== SERVER START ==================
const PORT = 8000;

sequelize.sync({ alter: true })
.then(() => {
    console.log("DB synced");
    server.listen(PORT, () => {
        console.log(`server is running on Port no ${PORT}`);
    });
})
.catch(err => {
    console.log("DB error:", err);
});
