import nodemailer from "nodemailer";

const sendEmail = async (email, subject, text) => {
	try {
		let transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: 587,
			secure: true,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});

		let info = await transporter.sendMail({
			from: process.env.SMTP_USER,
			to: email,
			subject: subject,
			text: text,
		});
		console.log(info);
	} catch (error) {
		console.error("Error in sending email",error);
        throw error
	}
};

export {sendEmail};