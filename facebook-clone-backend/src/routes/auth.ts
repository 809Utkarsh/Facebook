        import { Router } from "express";
        import { register, login } from "../controllers/authController";
        import { authMiddleware } from "../middlewares/authMiddleware"; // Import your JWT authentication middleware

        const router = Router();

        router.post("/register", register);
        router.post("/login", login);

        // Logout route
        router.post("/logout", authMiddleware, (req, res) => {
            // Here, you can implement token invalidation if using a blacklist
            return res.status(200).json({ message: "Logged out successfully" });
        });

        export default router;
