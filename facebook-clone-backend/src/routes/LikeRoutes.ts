import { Router } from "express";
import { toggleLikePost, getLikesByPost } from "../controllers/likeController"; // Import toggleLikePost
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

console.log("LikeRoutes initialized");

// Toggle like/unlike a post
router.post("/", authMiddleware, async (req, res) => {
    console.log("Route hit: POST /like", { body: req.body, user: req.user });
    if (!req.user) {
        console.log("Unauthorized attempt to like/unlike post");
        return res.status(401).json({ error: "Unauthorized. Please log in again." });
    }
    try {
        await toggleLikePost(req, res); // Call the new toggleLikePost function
    } catch (error) {
        console.error("Error in toggleLikePost:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get likes for a specific post
router.get("/post/:post_id", async (req, res) => {
    console.log("Route hit: GET /like/post/:post_id", { params: req.params });
    try {
        await getLikesByPost(req, res);
    } catch (error) {
        console.error("Error in getLikesByPost:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
