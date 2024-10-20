export async function avatarController(req,res) {
    const {link} = req.body

    if(!link){
        return res.status(400).send("Link is required")
    }

    try {
        const newAvatar = new Avatar({link})
        await newAvatar.save()
        
        return res.status(201).json({success: true,message: "Avatar created successfully"})
    } catch (error) {
        return res.status(500).json({success: false,message: "Internal server error"})
    }
}


export async function getAllAvatars(req,res) {
    try {
        const avatars = await Avatar.find()
        return res.status(200).json({success: true,avatars})
    } catch (error) {
        return res.status(500).json({success: false,message: "Internal server error"})
    }
}