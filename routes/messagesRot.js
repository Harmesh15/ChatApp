const express = require("express");
const router = express.Router();
const messageCon = require("../controller/messageCon");
const authenticaton = require("../middleware/authe");
 
console.log("message route hit");
router.post("/newmessage",authenticaton,messageCon.messageReceive);
router.get("/loadmessage",messageCon.loadmessage);
console.log("message route done");


module.exports = router;