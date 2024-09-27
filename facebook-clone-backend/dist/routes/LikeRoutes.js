"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likeController_1 = require("../controllers/likeController"); // Import toggleLikePost
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
console.log("LikeRoutes initialized");
// Toggle like/unlike a post
router.post("/", authMiddleware_1.authMiddleware, async (req, res) => {
    console.log("Route hit: POST /like", { body: req.body, user: req.user });
    if (!req.user) {
        console.log("Unauthorized attempt to like/unlike post");
        return res.status(401).json({ error: "Unauthorized. Please log in again." });
    }
    try {
        await (0, likeController_1.toggleLikePost)(req, res); // Call the new toggleLikePost function
    }
    catch (error) {
        console.error("Error in toggleLikePost:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Get likes for a specific post
router.get("/post/:post_id", async (req, res) => {
    console.log("Route hit: GET /like/post/:post_id", { params: req.params });
    try {
        await (0, likeController_1.getLikesByPost)(req, res);
    }
    catch (error) {
        console.error("Error in getLikesByPost:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
