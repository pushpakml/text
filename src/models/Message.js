import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            unique: true,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Message =
    mongoose.models.Message ||
    mongoose.model("Message", messageSchema);

export default Message;