const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const mediaController = require("../controller/mediaController");

router.post("/upload",upload.single("media"),mediaController.uploadMedia);

module.exports = router;