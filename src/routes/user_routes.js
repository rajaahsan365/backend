import { Router } from "express";
import upload from "../middlewares/upload_middleware.js";

const router = Router();

router.post("/signup", upload.single("logo"), (req, res) => {
    console.log(req.file); // Log the uploaded file information
    console.log(req.body); // Log the form data
    return res.status(200).json({
        message: "User signed up successfully",
        user: req.body,
    });
});


router.get("/login", (req, res) => {
    res.render("login", { title: "Login" });
});

router.get("/profile", (req, res) => {
    res.render("profile", { title: "Profile" });
});

router.get("/logout", (req, res) => {
    // Handle logout logic here
    res.redirect("/login");
});

export default router; 