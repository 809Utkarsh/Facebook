"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likeController_1 = require("../controllers/likeController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Like a post
router.post("/", authMiddleware_1.authMiddleware, likeController_1.likePost);
// Unlike a post
router.delete("/:post_id", authMiddleware_1.authMiddleware, likeController_1.unlikePost);
// Get likes for a specific post
router.get("/post/:post_id", likeController_1.getLikesByPost);
exports.default = router;
