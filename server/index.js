import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./database/db.js"
import Razorpay from "razorpay"
import cors from "cors"
dotenv.config()

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
})

const app = express()

// using middlewares
app.use(express.json())
app.use(cors())

const port = process.env.PORT

app.get("/", (req, res) => {
  res.send("Server is working")
})

app.use("/uploads", express.static("uploads"))

// importing routes
import userRoutes from "./routes/user.js"
import courseRoutes from "./routes/course.js"
import adminRoutes from "./routes/admin.js"
import quizRoutes from "./routes/quiz.js"
// using routes
app.use("/api", userRoutes)
app.use("/api", courseRoutes)
app.use("/api", adminRoutes)
app.use("/api", quizRoutes)
// const uploadFileToS3 = async () => {
//   const __dirname = path.resolve();
//   const filePath = path.join(__dirname, "uploads", "0a431416-da42-4517-9bc6-9a435cb8a5c5.png");

//   try {
//     const fileBuffer = await fs.promises.readFile(filePath); // Using promises.readFile
//     await UploadToS3Bucket({
//       filename: "images/k.png",
//       fileContent: fileBuffer,
//       mimetype: "image/png",
//     });
//     console.log("File upload success");
//   } catch (error) {
//     console.error("Error uploading file:", error);
//   }
// };

// uploadFileToS3();
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
  connectDb()
})
