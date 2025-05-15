import { cloudinary, getPublicIdFromUrl, uploadFileToCloudinary } from "../lib/cloudinary.js";
import Video from "../models/video_model.js";
import { videoValidation } from "../utils/validate_schema.js";

export const getAllVideos = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const videos = await Video.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            message: "Videos fetched successfully",
            videos,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const getVideoById = async (req, res, next) => {
    try {
        const { videoId } = req.params;

        if (!videoId) {
            return res.status(400).json({
                message: "Video ID is required",
            });
        }

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                message: "Video not found",
            });
        }

        return res.status(200).json({
            message: "Video fetched successfully",
            video,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const uploadVideo = async (req, res, next) => {
    try {
        const { title, description, category, tags } = req.body;
        const { video, thumbnail } = req.files;
        const userId = req.user._id;

        if (!video || !thumbnail) {
            return res.status(400).json({
                message: "Please upload both video and thumbnail",
            });
        }

        const tagArray = tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag);

        const { error } = videoValidation({
            title,
            description,
            category,
            tags: tagArray,
        });
        if (error) {
            return res.status(400).json({
                message: error.details.map((err) => err.message),
            });
        }
        // Assuming uploadFileToCloudinary is a function that uploads files to Cloudinary
        const videoUrl = await uploadFileToCloudinary(video[0].path);
        const thumbnailUrl = await uploadFileToCloudinary(thumbnail[0].path);

        console.log(
            `Video URL: ${videoUrl.secure_url}, Thumbnail URL: ${thumbnailUrl.secure_url}`
        );

        if (!videoUrl.secure_url) {
            return res.status(400).json({
                message: "Video upload failed",
            });
        }
        if (!thumbnailUrl.secure_url) {
            return res.status(400).json({
                message: "Thumbnail upload failed",
            });
        }

        const uploadVideo = new Video({
            title,
            description,
            category,
            tags: tagArray,
            videoUrl: videoUrl.secure_url,
            thumbnailUrl: thumbnailUrl.secure_url,
            userId,
        });

        const savedVideo = await uploadVideo.save();
        return res.status(201).json({
            message: "Video uploaded successfully",
            video: savedVideo,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const updateVideo = async (req, res, next) => {
    try {
        const { videoId } = req.params;
        const { title, description, category, tags } = req.body;
        const { video, thumbnail } = req.files;
        const userId = req.user._id;

        if (!videoId) {
            return res.status(400).json({
                message: "Video ID is required",
            });
        }
        // Check if the user is the owner of the video
        const videoToUpdate = await Video.findById(videoId);
        if (!videoToUpdate) {
            return res.status(404).json({
                message: "Video not found",
            });
        }

        if (videoToUpdate.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this video",
            });
        }

        const tagArray = tags
            ? tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag)
            : [];

        const { error } = videoValidation({
            title,
            description,
            category,
            tags: tagArray,
        });
        if (error) {
            return res.status(400).json({
                message: error.details.map((err) => err.message),
            });
        }

        if (thumbnail[0].path) {
            // Delete old thumbnail
            const publicId = getPublicIdFromUrl(videoToUpdate.thumbnailUrl);
            await cloudinary.uploader.destroy(publicId); // default resource_type: "image"
        }
        if (video[0].path) {
            // Delete old video
            const publicId = getPublicIdFromUrl(videoToUpdate.videoUrl);
            await cloudinary.uploader.destroy(publicId, {
                resource_type: "video",
            });
        }

        const videoUrl = await uploadFileToCloudinary(video[0].path);
        const thumbnailUrl = await uploadFileToCloudinary(thumbnail[0].path);

        const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            {
                title,
                description,
                category,
                tags: tagArray,
                videoUrl: videoUrl.secure_url,
                thumbnailUrl: thumbnailUrl.secure_url,
                userId,
            },
            { new: true }
        );

        if (!updatedVideo) {
            return res.status(404).json({
                message: "Video not found",
            });
        }

        return res.status(200).json({
            message: "Video updated successfully",
            video: updatedVideo,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const deleteVideo = async (req, res, next) => {
    try {
        const { videoId } = req.params;
        const userId = req.user._id;

        if (!videoId) {
            return res.status(400).json({
                message: "Video ID is required",
            });
        }

        // Check if the user is the owner of the video
        const videoToDelete = await Video.findById(videoId);
        if (!videoToDelete) {
            return res.status(404).json({
                message: "Video not found",
            });
        }

        if (videoToDelete.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this video",
            });
        }

        // Delete video from Cloudinary
        const publicId = getPublicIdFromUrl(videoToDelete.videoUrl);
        await cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
        });

        // Delete thumbnail from Cloudinary
        const thumbnailPublicId = getPublicIdFromUrl(videoToDelete.thumbnailUrl);
        await cloudinary.uploader.destroy(thumbnailPublicId); // default resource_type: "image"

        // Delete video from database
        await Video.findByIdAndDelete(videoId);

        return res.status(200).json({
            message: "Video deleted successfully",
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const likeVideo = async (req, res, next) => {
    try {
        const { videoId } = req.params;
        const userId = req.user._id;

        if (!videoId) {
            return res.status(400).json({
                message: "Video ID is required",
            });
        }

        // Check if the user has already liked the video
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                message: "Video not found",
            });
        }

        if (video.likedBy.includes(userId)) {
            return res.status(400).json({
                message: "You have already liked this video",
            });
        }

        // Add user to likedBy array
        video.likedBy.push(userId);
        await video.save();

        return res.status(200).json({
            message: "Video liked successfully",
            video,
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}

export const dislikeVideo = async (req, res, next) => {
    try {
        const { videoId } = req.params;
        const userId = req.user._id;

        if (!videoId) {
            return res.status(400).json({
                message: "Video ID is required",
            });
        }
        // Check if the user has already disliked the video
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                message: "Video not found",
            });
        }

        if (video.dislikedBy.includes(userId)) {
            return res.status(400).json({
                message: "You have already disliked this video",
            });
        }
        // Check if the user has already liked the video
        if (video.likedBy.includes(userId)) {
            // Remove user from likes array
            video.likedBy = video.likedBy.filter((id) => id.toString() !== userId.toString());
        }
        // Add user to dislikedBy array
        video.dislikedBy.push(userId);
        await video.save();
        return res.status(200).json({
            message: "Video disliked successfully",
            video,
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const viewVideo = async (req, res, next) => {
    try {
        const { videoId } = req.params;
        const userId = req.user._id;

        if (!videoId) {
            return res.status(400).json({
                message: "Video ID is required",
            });
        }

        // Check if the user has already viewed the video
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                message: "Video not found",
            });
        }

        if (video.viewedBy.includes(userId)) {
            return res.status(400).json({
                message: "You have already viewed this video",
            });
        }

        // Add user to viewedBy array
        video.viewedBy.push(userId);
        await video.save();

        return res.status(200).json({
            message: "Video viewed successfully",
            video,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}