import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        experience: {
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

const Teacher =
    mongoose.models.Teacher ||
    mongoose.model("Teacher", teacherSchema);

export default Teacher;