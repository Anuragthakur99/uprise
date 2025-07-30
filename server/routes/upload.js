// routes/upload.js
import express from "express";
import multer from "multer";
import { UploadToS3Bucket } from "../utils/s3";  // Assuming your s3 upload logic is in 'utils/s3.js'
import dotenv from "dotenv";
dotenv.config();

const uploadRouter = express.Router();
const upload = multer(); // Initialize multer for handling multipart form data

// POST route to handle video uploads
uploadRouter.post("/upload-to-s3", upload.single("file"), async (req, res) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Generate a unique file name
    const filename = `lectures/${Date.now()}-${file.originalname}`;

    // Call the function to upload to S3
    const fileContent = file.buffer; // Multer stores the file as a buffer
    const mimetype = file.mimetype;
    await UploadToS3Bucket({ filename, fileContent, mimetype });

    // Return the S3 URL of the uploaded file
    const videoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${filename}`;
    res.json({ videoUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

export default uploadRouter;
