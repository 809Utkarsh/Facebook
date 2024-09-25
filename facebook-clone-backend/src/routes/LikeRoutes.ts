import { Router } from "express";
import { likePost, unlikePost, getLikesByPost } from "../controllers/likeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Like a post
router.post("/", authMiddleware, likePost);

// Unlike a post
router.delete("/:post_id", authMiddleware, unlikePost);

// Get likes for a specific post
router.get("/post/:post_id", getLikesByPost);

export default router;
