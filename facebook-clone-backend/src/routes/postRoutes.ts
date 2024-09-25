import { Router } from "express";
import { createPost, getPosts } from "../controllers/postController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createPost);
router.get("/", getPosts);

export default router;
