import { model, Schema } from "mongoose";

const videoSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        videoUrl: {
            type: String,
            required: true,
            trim: true,
        },
        thumbnailUrl: {
            type: String,
            required: true,
            trim: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                "Education",
                "Entertainment",
                "Music",
                "Sports",
                "News",
                "Technology",
            ],
            default: "Education",
        },
        tags: {
            type: [String],
            required: true,
            trim: true,
        },
        likedBy: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        dislikedBy: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        viewedBy: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

videoSchema.virtual("likes").get(function () {
    return this.likedBy.length;
});

videoSchema.virtual("dislikes").get(function () {
    return this.dislikedBy.length;
});
videoSchema.virtual("views").get(function () {
    return this.viewedBy.length;
});

videoSchema.set("toJSON", {
    virtuals: true,
});

const Video = model("Video", videoSchema);

export default Video;
