import mongoose from "mongoose";

export const connect = async () => {
	try {
		await mongoose.connect(process.env.DB);
		console.log("DB connected successfully");
	} catch (error) {
		console.log(error);
		console.log("Database not connected");
	}
};
