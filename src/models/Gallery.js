import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
        },

        title: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Gallery =
    mongoose.models.Gallery ||
    mongoose.model("Gallery", gallerySchema);

export default Gallery;