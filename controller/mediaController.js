const s3 = require("../configur/s3");


exports.uploadMedia = async (req, res) => {
  try {
    const file = req.file;

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `chat-media/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(params).promise();

    return res.status(200).json({
      success: true,
      fileUrl: data.Location,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};