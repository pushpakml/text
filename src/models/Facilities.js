import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
    {
        // Facility 1
        title: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            default: "",
        },
        image: {
            type: String,
            default: "",
        },

        // Facility 2
        title1: {
            type: String,
            default: "",
        },
        description1: {
            type: String,
            default: "",
        },
        image1: {
            type: String,
            default: "",
        },

        // Facility 3
        title2: {
            type: String,
            default: "",
        },
        description2: {
            type: String,
            default: "",
        },
        image2: {
            type: String,
            default: "",
        },

        // Facility 4
        title3: {
            type: String,
            default: "",
        },
        description3: {
            type: String,
            default: "",
        },
        image3: {
            type: String,
            default: "",
        },

        // Facility 5
        title4: {
            type: String,
            default: "",
        },
        description4: {
            type: String,
            default: "",
        },
        image4: {
            type: String,
            default: "",
        },

        // Facility 6
        title5: {
            type: String,
            default: "",
        },
        description5: {
            type: String,
            default: "",
        },
        image5: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Facility =
    mongoose.models.Facility ||
    mongoose.model("Facility", facilitySchema);

export default Facility;