const express = require("express");
const http = require("http");
const sequelize = require("./utils/db-connection"); 
// const {Server} = require("socket.io");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
// const chatusers = require("./models/chatusers");


const socketIo = require("./socket_io/index")


const userRouter = require("./routes/loginSignupRot");
const messageRoute = require("./routes/messagesRot");




const app = express();
const server = http.createServer(app);
socketIo(server);


// const io = new Server(server, {
//   cors: {
//     origin: "*"
//   }
// });


// ================== MIDDLEWARE ==================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));


// after socket///////////////////

// io.use( async (socket, next) => {
//   console.log("middlw ware backend run")
//   try{
//         const token = socket.handshake.auth.token;

//         if(!token){
//          return next(new Error("Token is missing"));
//       }
//     const decode = jwt.verify(token, "secretkey"); 
//     const user = await chatusers.findByPk(decode.userId);
//     console.log("USER:", user);
//     console.log("this is user for username",user)

//       if(!user){
//          return next( new Error("user not found"));
//       }
//       socket.user = user;
//       next();
//    }catch(error){
//     console.log("SOCKET ERROR:", error);
//          return next( new Error("Internal server error"));
//   }
// });











 // ================== SOCKET ================== AUth============

//  io.on('connection',(socket)=>{
//     console.log("A new user message",socket.id);

//     socket.on("send_message",(messages)=>{
//         console.log("message",messages);

//        io.emit("receive_message",messages)
//     });
      
//     console.log("disconnectedd");
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

sequelize.sync({ alter: false })
.then(() => {
    console.log("DB synced");
    server.listen(PORT, () => {
        console.log(`server is running on Port no ${PORT}`);
    });
})
.catch(err => {
    console.log("DB error:", err);
});
