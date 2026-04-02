const express = require("express");
const app = express();
const sequelize = require("./utils/db-connection"); 
const path = require("path");
const userRouter = require("./routes/loginSignupRot");


app.use(express.json());
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

app.use("/user",userRouter);

const PORT = 8000;
sequelize.sync({alter:false})
.then(()=>{
    console.log("DB synced");
    app.listen(PORT,()=>{
 console.log(`server is running on Port no ${PORT}`);
})
})

