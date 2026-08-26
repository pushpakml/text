import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
    sub_title: String,
    span:String,
    span1:String,
    span2:String,
    span3:String,
    description: String,
    button1:String,
    button2:String,
    button3:String,
    counternumber:String,
    countertext:String,
    counternumber1:String,
    countertext1:String,
    counternumber2:String,
    countertext2:String
});

const Hero = mongoose.models.Hero || mongoose.model("Hero", heroSchema);

export default Hero; 