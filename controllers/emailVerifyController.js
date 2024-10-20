import { User } from "../models/userModel"

const verifyEmail = async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user){
            return res.status(400).send("User not found")
        }
        if(user.verified){
            return res.status(400).send("User already verified")
        }
        const token = await Token.findOne({userId:user._id,token:req.params.id})

        if(!token){
            return res.status(400).send("Invalid link")
        }
        if (token.expiresAt < Date.now()){
            user.verificationLinkSent = false
            return res.status(400).send({message:"Link expired"})
        }
        user.verified = true
        await user.save()

        return res.status(200).send("Email verified successfully")
    }   catch(error){
        console.log(error)
        return res.status(500).send({message:"Internal server error"})
    }

}

export {verifyEmail}