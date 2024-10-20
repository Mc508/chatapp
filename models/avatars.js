import mongoose from "mongoose";

const avatarSchema = new mongoose.Schema({
    link:{
        type:String,
        required:true,
        default:"https:/i.imgur.com/qGsYvAK.png",

    }
},{timestamps:true})

const Avatar = mongoose.model("Avatar",avatarSchema)

export {
    Avatar
}