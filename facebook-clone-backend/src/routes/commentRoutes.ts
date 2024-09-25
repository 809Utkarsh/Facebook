        // routes/commentRoutes.ts
        import { Router } from "express";
        import { createComment, getCommentsByPost, updateComment, deleteComment } from "../controllers/commentController";
        import { authMiddleware } from "../middlewares/authMiddleware";
        const router = Router();

        // Create a comment
        router.post("/",authMiddleware, createComment); // Ensure this line is correct

        // Get all comments for a specific post
        router.get("/post/:post_id", getCommentsByPost);

        // Update a comment
        router.put("/:comment_id", updateComment);

        // Delete a comment
        router.delete("/:comment_id", deleteComment);

        export default router;
