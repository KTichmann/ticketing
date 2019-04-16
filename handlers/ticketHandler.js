const { Client } = require("pg");
const { DATABASE_URL } = process.env;
const client = new Client({
	connectionString: DATABASE_URL
});

class TicketHandler {
	constructor() {
		client
			.connect()
			.catch(err => console.log("connection error: ", err.toString()));

		this.createTicket = this.createTicket.bind(this);
		this.moveTicket = this.moveTicket.bind(this);
		this.checkUserAccess = this.checkUserAccess.bind(this);
		this.getGroupId = this.getGroupId.bind(this);
		this.deleteTicket = this.deleteTicket.bind(this);
	}

	createTicket(req, res) {
		const { group_id, title, description, reporter_email } = req.body;
		const checkEmailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
		const query = {
			text:
				"INSERT INTO tickets(group_id, title, description, reporter_email) VALUES ($1, $2, $3, $4)",
			values: [group_id, title, description, reporter_email]
		};
		if (!group_id) {
			this.reject(res, "group_id cannot be empty");
			return;
		}
		if (!title) {
			this.reject(res, "title cannot be empty");
			return;
		}
		if (!description) {
			this.reject(res, "description cannot be empty");
			return;
		}
		if (!reporter_email) {
			this.reject(res, "reporter_email cannot be empty");
			return;
		} else if (!reporter_email.match(checkEmailRegex)) {
			this.reject(res, "reporter_email must be a valid email address");
			return;
		}
		//Check if group exists
		const checkGroupIdQuery = {
			text: "SELECT * FROM groups WHERE group_id=$1",
			values: [group_id]
		};
		client
			.query(checkGroupIdQuery)
			.then(result => {
				if (result.rows[0]) {
					client
						.query(query)
						.then(result => {
							res.json({
								success: true,
								message: "ticket logged successfully"
							});
						})
						.catch(error => {
							console.log(error);
							res.json({
								success: false,
								message: "error saving ticket",
								error: error
							});
							return;
						});
				} else {
					this.reject(res, "group_id does not match any group");
				}
			})
			.catch(error => {
				console.log(error);
				res.json({
					success: false,
					message: "error checking group_id",
					data: error
				});
				return;
			});
	}
	moveTicket(req, res) {
		const { ticket_id, status } = req.body;
		const username = req.decoded;
		const query = {
			text: "UPDATE tickets SET status=$1 WHERE id=$2",
			values: [status, ticket_id]
		};
		const getGroupId = {
			text: "SELECT group_id from tickets WHERE id=$1",
			values: [ticket_id]
		};
		if (!ticket_id) {
			this.reject(res, "ticket id cannot be empty");
			return;
		}
		if (!status) {
			this.reject(res, "status cannot be empty");
			return;
		}
		this.getGroupId(ticket_id, res)
			.then(result => {
				this.checkUserAccess(username, result, res).then(result => {
					if (result) {
						client
							.query(query)
							.then(result =>
								res.json({
									success: true,
									message: "ticket successfully moved"
								})
							)
							.catch(error => {
								console.log(error);
								this.reject(res, "error checking user");
							});
					}
				});
			})
			.catch(error => {
				console.log(error);
				this.reject(res, "error moving ticket");
			});
	}

	deleteTicket(req, res) {
		const username = req.decoded;
		const { ticket_id } = req.body;
		const query = {
			text: "DELETE FROM tickets WHERE id = $1",
			values: [ticket_id]
		};
		this.getGroupId(ticket_id, res)
			.then(result => {
				if (result) {
					this.checkUserAccess(username, result, res)
						.then(result => {
							if (result) {
								client
									.query(query)
									.then(result => {
										res.json({
											success: true,
											message: "ticket deleted successfully"
										});
									})
									.catch(error => {
										console.log(error);
										this.reject(res, "error deleting ticket");
									});
							}
						})
						.catch(error => {
							console.log(error);
							this.reject(res, "error checking user access");
						});
				}
			})
			.catch(error => {
				console.log(error);
				this.reject(res, "ticket group not found");
			});
	}

	commentOnTicket(req, res) {}

	getGroupId(ticket_id, res) {
		const getGroupId = {
			text: "SELECT * from tickets WHERE id=$1",
			values: [ticket_id]
		};

		return client
			.query(getGroupId)
			.then(result => {
				if (result.rows[0]) {
					return result.rows[0].group_id;
				} else {
					this.reject(res, "group_id not found");
					return false;
				}
			})
			.catch(error => {
				console.log(error);
				this.reject(res, "Error finding ticket's group");
				return false;
			});
	}

	checkUserAccess(username, group_id, res) {
		const query = {
			text: "SELECT * FROM admins WHERE username=$1 AND group_id=$2",
			values: [username, group_id]
		};
		return client
			.query(query)
			.then(result => {
				if (result.rows[0]) {
					return true;
				} else {
					this.reject(res, "current user cannot update ticket");
					return false;
				}
			})
			.catch(error => {
				console.log(error);
				this.reject(res, "error checking user access");
				return false;
			});
	}
	reject(res, message) {
		res.json({
			success: false,
			message: message
		});
	}
}

const ticketHandler = new TicketHandler();

module.exports = {
	ticketHandler: ticketHandler
};
