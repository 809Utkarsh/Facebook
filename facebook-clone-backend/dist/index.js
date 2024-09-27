"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const LikeRoutes_1 = __importDefault(require("./routes/LikeRoutes"));
const app = (0, express_1.default)();
// Use CORS middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true, // Allow credentials (like cookies) to be sent
}));
app.use(express_1.default.json());
// Serve static files from the correct "media" directory
console.log("Serving media files from:", path_1.default.join(__dirname, '..', '..', 'media'));
app.use('/media', express_1.default.static('/home/utkarsh/facebook/facebook-clone-backend/media'));
// Add error handling for serving static files
app.use((err, req, res, next) => {
    if (err.code === 'ENOENT') {
        console.error(`File not found: ${req.url}`);
        res.status(404).send('File not found');
    }
    else {
        console.error(`Error serving static file: ${err.message}`);
        res.status(500).send('Internal Server Error');
    }
});
// Log the media directory being served
console.log("Serving media files from:", path_1.default.join(__dirname, '..', 'media'));
app.use("/api/auth", auth_1.default);
app.use("/api/posts", postRoutes_1.default);
app.use("/api/comments", commentRoutes_1.default);
app.use("/api/likes", LikeRoutes_1.default); // Use the like routes
// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});
mongoose_1.default.connect(process.env.MONGO_URI || "")
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log("MongoDB connection error:", error));
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
