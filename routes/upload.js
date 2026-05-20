// routes/upload.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const s3 = require("../configur/s3");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {

  try {
    const file = req.file;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: Date.now() + "_" + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    const data = await s3.upload(params).promise();

    res.json({
      success: true,
      url: data.Location
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;