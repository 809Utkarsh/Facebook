"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Import cors
const auth_1 = __importDefault(require("./routes/auth"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const LikeRoutes_1 = __importDefault(require("./routes/LikeRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Use CORS middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true, // Allow credentials (like cookies) to be sent
}));
app.use(express_1.default.json());
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
