import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    image:String
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event; 