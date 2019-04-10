const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { Client } = require("pg");
const nodemailer = require("nodemailer");
const { DATABASE_URL, SECRET, PASS } = process.env;
const client = new Client({
	connectionString: DATABASE_URL
});

class UserHandler {
	constructor() {
		client
			.connect()
			.catch(err => console.log("connection error: ", err.toString()));

		this.signUp = this.signUp.bind(this);
	}

	signUp(req, res) {
		const username = req.body.username;
		const password = req.body.password;
		const email = req.body.email;
		const checkEmailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

		if (!username) {
			res.json({
				success: false,
				message: "username cannot be empty"
			});
		} else if (!password) {
			res.json({
				success: false,
				message: "password cannot be empty"
			});
		} else if (!email) {
			res.json({
				success: false,
				message: "email cannot be empty"
			});
		} else if (!email.match(checkEmailRegex)) {
			res.json({
				success: false,
				message: "must be a valid email address"
			});
		}

		//Checks if username is unique
		const usernameQuery = {
			text: "SELECT username FROM users WHERE username = $1",
			values: [username]
		};
		client
			.query(usernameQuery)
			.then(result => {
				if (result.rows[0] != undefined) {
					//TODO: send proper response with error code etc.
					res.json({
						success: false,
						message: "username taken"
					});
				} else {
					//Hash password
					const hashedPass = md5(password);
					//Add password and username to database
					const query = {
						text:
							"INSERT INTO users(username, password, email) VALUES ($1, $2, $3)",
						values: [username, hashedPass, email]
					};
					//Create user verification hash
					const verificationHash = md5(username);
					const verificationQuery = {
						text:
							"INSERT INTO verification(username, verificationHash) VALUES ($1, $2)",
						values: [username, verificationHash]
					};
					client
						.query(verificationQuery)
						.then(() => {
							console.log(email);
							//SEND VERIFICATION EMAIL
							this.sendEmail(email, username, verificationHash);
							client
								.query(query)
								.then(() => {
									res.json({
										success: true,
										message: "User successfully signed up"
									});
								})
								.catch(error =>
									res.json({
										success: false,
										message: "Unidentified error"
									})
								);
						})
						.catch(error =>
							res.json({ success: false, message: "Unidentified error" })
						);
				}
			})
			.catch(error => res.send(error.toString()));
	}

	authenticate(req, res) {
		//Check if username/password are in the database - if not, throw an error
		const username = req.body.username;

		//check if username is in database
		const query = {
			text: "SELECT password, verified FROM users WHERE username = $1",
			values: [username]
		};
		client
			.query(query)
			.then(result => {
				const password = result.rows[0].password;
				const isVerified = result.rows[0].verified;
				const row = result.rows[0];
				if (row === undefined) {
					res.json({
						success: false,
						message: "authentication unsuccessful"
					});
				} else if (!isVerified) {
					res.json({
						success: false,
						message: "email not verified"
					});
				} else {
					//Check if password is correct
					if (password === md5(req.body.password)) {
						//password is correct
						//create a jwt token, and send it back in response
						const payload = {
							username: username
						};

						const token = jwt.sign(payload, SECRET, {
							expiresIn: "24h"
						});
						res.json({
							success: true,
							message: "Authentication Successful",
							token: token
						});
					} else {
						//send an error message
						res.json({
							success: false,
							message: "authentication unsuccessful",
							data: result
						});
					}
					res.json({
						success: false,
						message: "username exists"
					});
				}
			})
			.catch(error =>
				res.json({
					success: false,
					message: "error authenticating user",
					data: error
				})
			);
	}

	verify(req, res) {
		const hash = req.params.hash;
		query = {
			text: "SELECT * FROM verification WHERE verificationhash=$1",
			values: [hash]
		};

		client.query(query).then(result => {
			const row = result.rows[0];
			if (row === undefined) {
			}
		});
		//req.params.hash
	}

	sendEmail(email, username, hash) {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "thebobewithyou@gmail.com",
				pass: PASS
			},
			tls: {
				rejectUnauthorized: false
			}
		});
		console.log(PASS);

		const mailOptions = {
			from: "thebobewithyou@gmail.com",
			to: `${email}`,
			subject: "Verify your Ticketing Account",
			html: `
			<p>Hello ${username},</p>
			<br>
			<p>Thanks for signing up to Ticketing!</p>
			<br>
			<p>Please verify your account by clicking the link below: INSERTLINK/verify/${hash}</p>
			<br>
			<p>The Ticketing Team</p>
			`
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
//TODO
//Add a change password section

const userHandler = new UserHandler();

module.exports = {
	userHandler: userHandler
};
