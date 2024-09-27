"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const upload_1 = require("../middlewares/upload");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.authMiddleware, upload_1.upload.single('file'), postController_1.createPost);
router.get("/", postController_1.getPosts);
exports.default = router;
