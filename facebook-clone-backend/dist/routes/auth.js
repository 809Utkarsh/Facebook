"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Import your JWT authentication middleware
const router = (0, express_1.Router)();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
// Logout route
router.post("/logout", authMiddleware_1.authMiddleware, (req, res) => {
    // Here, you can implement token invalidation if using a blacklist
    return res.status(200).json({ message: "Logged out successfully" });
});
exports.default = router;
