"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/commentRoutes.ts
const express_1 = require("express");
const commentController_1 = require("../controllers/commentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Create a comment
router.post("/", authMiddleware_1.authMiddleware, commentController_1.createComment); // Ensure this line is correct
// Get all comments for a specific post
router.get("/post/:post_id", commentController_1.getCommentsByPost);
// Update a comment
router.put("/:comment_id", commentController_1.updateComment);
// Delete a comment
router.delete("/:comment_id", commentController_1.deleteComment);
exports.default = router;
