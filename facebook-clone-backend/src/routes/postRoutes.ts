    import { Router } from "express";
    import { createPost, getPosts } from "../controllers/postController";
    import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";

    const router = Router();

  
    router.post("/", authMiddleware, upload.single('file'), createPost);
    router.get("/", getPosts);

    export default router;
