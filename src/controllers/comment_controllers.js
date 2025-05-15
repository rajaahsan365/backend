import comment from "../models/comment_model.js";
import Video from "../models/video_model.js";

export const getAllComments = async (req, res, next) => {
    try {
        const { videoId } = req.params;

        if (!videoId) {
            return res.status(400).json({ message: "videoId is required" });
        }
        const comments = await comment
            .find({ videoId })
            .populate("userId", "channelName email logo")
            .sort({ createdAt: -1 });

        if (!comments) {
            return res.status(404).json({ message: "No comments found" });
        }

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments,
        });
    } catch (error) {
        console.log("🚀 ~ getAllComments ~ error:", error);
        next(error);
    }
};
export const addComment = async (req, res, next) => {
    try {
        const { videoId } = req.params;
        const { comment: commentText } = req.body;

        if (!videoId) {
            return res.status(400).json({ message: "videoId is required" });
        }
        if (!commentText) {
            return res.status(400).json({ message: "Comment is required" });
        }
        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const newComment = await comment.create({
            userId: req.user._id,
            videoId,
            comment: commentText,
        });

        return res.status(201).json({
            message: "Comment added successfully",
            comment: newComment,
        });
    } catch (error) {
        console.log("🚀 ~ addComment ~ error:", error);
        next(error);
    }
};
export const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { _id: userId } = req.user;
        if (!commentId) {
            return res.status(400).json({ message: "commentId is required" });
        }
        const commentToDelete = await comment.findById(commentId);
        if (!commentToDelete) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (commentToDelete.userId.toString() !== userId.toString()) {
            return res
                .status(403)
                .json({ message: "You are not authorized to delete this comment" });
        }
        await comment.findByIdAndDelete(commentId);
        return res.status(200).json({
            message: "Comment deleted successfully",
        });
    } catch (error) {
        console.log("🚀 ~ deleteComment ~ error:", error);
        next(error);
    }
};
export const updateComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { _id: userId } = req.user;
        const { comment: commentText } = req.body;

        if (!commentId) {
            return res.status(400).json({ message: "commentId is required" });
        }
        if (!commentText) {
            return res.status(400).json({ message: "Comment is required" });
        }
        const commentToUpdate = await comment.findById(commentId);
        if (!commentToUpdate) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (commentToUpdate.userId.toString() !== userId.toString()) {
            return res
                .status(403)
                .json({ message: "You are not authorized to update this comment" });
        }
        const updatedComment = await comment.findByIdAndUpdate(
            commentId,
            { comment: commentText },
            { new: true }
        );
        return res.status(200).json({
            message: "Comment updated successfully",
            comment: updatedComment,
        });
    } catch (error) {
        console.log("🚀 ~ updateComment ~ error:", error);
        next(error);
    }
};
