const express = require("express");
const router = express.Router();
const messageCon = require("../controller/messageCon");
const verifyToken = require("../middleware/authe");
// const authenticaton = require("../middleware/authe");
 
console.log("message route hit");
router.post("/newmessage",verifyToken,messageCon.messageReceive);
router.get("/loadmessage",messageCon.loadmessage);
router.get("/loadusers",messageCon.loadUsers);
router.get("/find",messageCon.searchUser)

console.log("message route done");


module.exports = router;