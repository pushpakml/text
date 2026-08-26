import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
    logo: String,
    phone: Number,
    email:String
});

const Setting = mongoose.models.Setting || mongoose.model("Setting", settingSchema);

export default Setting; 