import { Router } from "express";
import upload from "../middlewares/upload_middleware.js";
import { loginController, registerController } from "../controllers/user_controllers.js";

const router = Router();

router
    .post("/signup", upload.single("logo"), registerController)
    .post("/login", loginController);

router.get("/profile", (req, res) => {
    res.render("profile", { title: "Profile" });
});

router.get("/logout", (req, res) => {
    // Handle logout logic here
    res.redirect("/login");
});

export default router; 