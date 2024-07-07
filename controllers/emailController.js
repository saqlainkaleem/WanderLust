const email = require("../utils/email.js");

const sendEmail = async (req, res) => {
	try {
		const emailResponse = await email.sendEmail(
			req.body.email,
			req.body.message,
			req.body.name
		);
		req.flash("success", "Message received successfully");
	} catch (error) {
		console.error("Failed to send email:", error);
		req.flash("error", "Failed to send message");
	}
	res.redirect("/contact");
};

module.exports = { sendEmail };
