import {Token} from "../models/tokenModel";
import {User, validateRegister} from "../models/userModel";
import bcrypt from "bcrypt";
import {User} from "../models/userModel";

const registerController = async (req, res) => {
	try {
		const {error} = validateRegister(req.body);
		if (error) {
			return res.status(400).send(error.details[0].message);
		}
		let user = await User.findOne({email: req.body.email});
		if (user && user.verified) {
			return res.status(400).send("User already registered");
		}
		if (user && user.verificationLinkSent) {
			return res.status(400).send("Verification link already sent");
		}
		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);
		user = await User.create({
			...req.body,
			password: hashPassword,
		});
		const token = new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
			createAt: Date.now(),
			expiresAt: Date.now() + 3600000,
		}).save();

		const url = `${process.env.BASE_URL}/users/${user._id}/api/verify/${user._id}/${token.token}`;
		await sendEmail(user.email, "Verify Email", url);
		user.verificationLinkSent = true;
		await user.save();
		res.status(200).send("Verification link sent to your email");
	} catch (error) {
		console.error("Error in registerController", error);
		res.status(500).send({message: "Something went wrong"});
	}
};

export {registerController};
