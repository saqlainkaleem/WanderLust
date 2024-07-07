const nodemailer = require("nodemailer");

const sendEmail = async (receiver, message, name) => {
	try {
		const auth = nodemailer.createTransport({
			service: "gmail",
			secure: true,
			port: 465,
			auth: {
				user: process.env.EMAIL,
				pass: process.env.EMAIL_PASS,
			},
		});

		const emailOptions = {
			from: process.env.EMAIL,
			to: process.env.EMAIL_RECEIVER,
			replyTo: receiver,
			subject: `Wanderlust! User ${name}`,
			text: `Hey New Message Received from - ${name}, Email - ${receiver}, Message - ${message}`,
		};

		const emailResponse = await auth.sendMail(emailOptions);
		return emailResponse;
	} catch (error) {
		throw error;
	}
};

module.exports = { sendEmail };
