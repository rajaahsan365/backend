import { model, Schema } from "mongoose";

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
    },
})

const comment = model("Comment", commentSchema);

export default comment;