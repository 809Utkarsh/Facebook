import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import Like from "./routes/LikeRoutes";


const app = express();

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow your frontend origin
  credentials: true, // Allow credentials (like cookies) to be sent
}));

app.use(express.json());
// Serve static files from the correct "media" directory
console.log("Serving media files from:", path.join(__dirname, '..', '..','media'));
app.use('/media', express.static('/home/utkarsh/facebook/facebook-clone-backend/media'));

// Add error handling for serving static files
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.code === 'ENOENT') {
    console.error(`File not found: ${req.url}`);
    res.status(404).send('File not found');
  } else {
    console.error(`Error serving static file: ${err.message}`);
    res.status(500).send('Internal Server Error');
  }
});

// Log the media directory being served
console.log("Serving media files from:", path.join(__dirname, '..', 'media'));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", Like);  // Use the like routes

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

mongoose.connect(process.env.MONGO_URI || "")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
