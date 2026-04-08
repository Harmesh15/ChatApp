const express = require("express");
const router = express.Router();
const messageCon = require("../controller/messageCon");
const authenticaton = require("../middleware/authe");

router.post("/newmassage",authenticaton,messageCon.messageReceive);
router.get("/loadmessage",messageCon.loadmessage);

console.log("message route hit");

module.exports = router;