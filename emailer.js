const nodemailer = require("nodemailer");
const { PASS } = process.env;

class Emailer {
	constructor(email) {
		this.email = email;
		console.log("email");
	}

	sendEmail() {
		console.log("inside emailer");
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "thebobewithyou@gmail.com",
				pass: PASS
			}
		});
		console.log("transporter created");

		const mailOptions = {
			from: "thebobewithyou@email.com",
			to: `${this.email}`,
			subject: "TESTING",
			html: "<p>Testing Body</p>"
		};
		console.log("mailOptions created");
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err);
			} else {
				console.log(info);
			}
		});
	}
}

module.exports = {
	Emailer: Emailer
};
