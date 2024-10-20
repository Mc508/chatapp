import mongoose from "mongoose"

const tokenSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    createdAt:{
        type:Date,
        default:Date.now() + 3600000 
    }
},{timestamps:true})

const Token = mongoose.model("Token",tokenSchema)

export {
    Token
}