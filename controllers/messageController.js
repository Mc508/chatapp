import { protect } from "../middleware/protect"

export const messageController = async(req,res)=>{
    const {userId} = req.params
    const userData = await protect(req)
    console.log("userData",userData);

    const ourUserId = userData._id;
    console.log("ourUserId",ourUserId);

    const messages = await Message.find({
        sender:{$in:[userId,ourUserId]},
        recipient:{$in:[userId,ourUserId]}
    }).sort({
        createdAt:1})
    res.json(messages)
    console.log("messages",messages);
}