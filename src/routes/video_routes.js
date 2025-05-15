import { Router } from "express";
import {
    deleteVideo,
    dislikeVideo,
    getAllVideos,
    getVideoById,
    likeVideo,
    updateVideo,
    uploadVideo,
    viewVideo,
} from "../controllers/video_controllers.js";
import { authenticateUser } from "../middlewares/auth_middleware.js";
import upload from "../middlewares/upload_middleware.js";

const router = Router();

router
    .get("/", authenticateUser, getAllVideos)
    .get("/:videoId", authenticateUser, getVideoById)
    .get("/like/:videoId", authenticateUser, likeVideo)
    .get("/dislike/:videoId", authenticateUser, dislikeVideo)
    .get("/view/:videoId", authenticateUser, viewVideo)
    .post(
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
    )
    .put(
        "/:videoId",
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
        updateVideo
    )
    .delete("/:videoId", authenticateUser, deleteVideo);

export default router;
