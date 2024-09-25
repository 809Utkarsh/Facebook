import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import authRoutes from "./routes/auth";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import Like from "./routes/LikeRoutes";

dotenv.config();

const app = express();

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow your frontend origin
  credentials: true, // Allow credentials (like cookies) to be sent
}));

app.use(express.json());

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
