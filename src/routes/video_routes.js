import { Router } from "express";
import { uploadVideo } from "../controllers/video_controller.js";
import { authenticateUser } from "../middlewares/auth_middleware.js";
import upload from "../middlewares/upload_middleware.js";

const router = Router();

router.post(
    "/",
    authenticateUser,
    upload.fields([
        {
            name: "video",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    uploadVideo
);
// .put("/:id", "")
// .delete("/", "")
// .get("/", "")
// .get("/:id", "")
// .post("/like", "")
// .post("/dislike-video/:id", "")
// .post("/view-video/:id", "")

export default router;
