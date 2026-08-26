import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
    title: String,
    description: String,
    description1: String,
    image:String
});

const About = mongoose.models.About || mongoose.model("About", aboutSchema);

export default About; 