import { Router } from "express";
import { authenticateUser } from "../middlewares/auth_middleware.js";
import {
    addComment,
    deleteComment,
    getAllComments,
    updateComment,
} from "../controllers/comment_controllers.js";

const router = Router();

router
    .get("/:videoId", authenticateUser, getAllComments)
    .post("/:videoId", authenticateUser, addComment)
    .delete("/:commentId", authenticateUser, deleteComment)
    .put("/:commentId", authenticateUser, updateComment);

export default router;