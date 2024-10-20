import { User } from "../models/userModel"

export const peopleController = async (req, res) => {
    const users =  await User.find({
        verified: true
    })

    res.json(users)
}