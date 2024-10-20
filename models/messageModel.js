import mongoose  from "mongoose";

const messageSchema = mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    text:{
        type:String,
        required:true
    }
},{timestamps:true})

const Message = mongoose.model("Message",messageSchema)

export {
    Message
}