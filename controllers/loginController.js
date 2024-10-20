import User from "../models/userModel";
import bcrypt from "bcrypt";
import {validateLogin} from "../models/userModel";

const loginController = async (req, res) => {
    try {
        const {error} = validateLogin(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }   
        let user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(400).send("Invalid email or password");
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send("Invalid email or password");
        }
        if (!user.verified) {
            return res.status(400).send("Please verify your email");
        }

        const token = user.generateAuthToken();
        res.status(200)
        .cookie("authToken", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            expires: new Date(Date.now() + 7*24*60*60*1000),
        })
        .send({message: "Logged in successfully",status:200});
        return
    } catch (error) {
        console.log("error in login controller",error);
        return res.status(500).send({message:"Internal server error"});
    }
}

export {loginController}