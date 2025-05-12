import { Router } from "express";
import upload from "../middlewares/upload_middleware.js";
import { loginController, logoutController, registerController } from "../controllers/user_controllers.js";

const router = Router();

router
    .post("/signup", upload.single("logo"), registerController)
    .post("/login", loginController)
    .post("/logout", logoutController);

router.get("/profile", (req, res) => {
    res.render("profile", { title: "Profile" });
});

export default router; 