const express = require("express");
const app = express();

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("server is running")
})

const PORT = 8000;
app.listen(PORT,()=>{
 console.log(`server is running on Port no ${PORT}`);
})



