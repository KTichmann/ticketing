const { Client } = require("pg");

const { DATABASE_URL } = process.env;
const client = new Client({
	connectionString: DATABASE_URL
});

class GroupHandler {
	constructor() {
		client
			.connect()
			.catch(err => console.log("connection error: ", err.toString()));

		this.createGroup = this.createGroup.bind(this);
		this.updateGroup = this.updateGroup.bind(this);
		this.deleteGroup = this.deleteGroup.bind(this);
		this.addAdmin = this.addAdmin.bind(this);
	}

	listGroups(req, res) {
		const username = req.decoded;
		const getGroupIds = {
			text: "SELECT group_id FROM admins WHERE username=$1",
			values: [username]
		};

		client
			.query(getGroupIds)
			.then(result => {
				let groupIds = result.rows;
				let groupIdText = "";
				for (let i = 2, j = groupIds.length + 1; i < j; i++) {
					groupIdText += `OR group_id=$${i} `;
				}
				const groupQuery = {
					text: `SELECT * FROM groups WHERE group_id=$1 ${groupIdText}`,
					values: [...groupIds.map(obj => obj.group_id)]
				};
				client
					.query(groupQuery)
					.then(result => {
						res.json({
							success: true,
							message: "results retrieved successfully",
							data: result.rows
						});
					})
					.catch(error => {
						console.log(error);
						res.json({
							success: false,
							message: "error fetching groups",
							error: error
						});
					});
			})
			.catch(error => {
				console.log(error);
				res.json({
					success: false,
					message: "error fetching groups"
				});
			});
	}

	createGroup(req, res) {
		const username = req.decoded;
		const title = req.body.title;
		const description = req.body.description ? req.body.description : "";
		//INSERT INTO comments (post_id, comment, username) VALUES ($1, $2, $3)
		const createGroupQuery = {
			text:
				"INSERT INTO groups (title, description) VALUES ($1, $2) RETURNING group_id",
			values: [title, description]
		};
		if (!title) {
			res.json({
				success: false,
				message: "title cannot be empty"
			});
			return;
		}
		client
			.query(createGroupQuery)
			.then(result => {
				const group_id = result.rows[0].group_id;
				const createAdminQuery = {
					text: "INSERT INTO admins (username, group_id) VALUES ($1, $2)",
					values: [username, group_id]
				};
				client
					.query(createAdminQuery)
					.then(result => {
						res.json({
							success: true,
							message: "group successfully added",
							data: {
								group_id: group_id
							}
						});
						return;
					})
					.catch(error => {
						console.log(error);
						res.json({
							success: false,
							message: "error adding user to group",
							error: error
						});
						return;
					});
			})
			.catch(error => {
				console.log(error);
				res.json({ success: false, message: "error creating group" });
				return;
			});
	}

	updateGroup(req, res) {
		const username = req.decoded;
		const title = req.body.title;
		const groupId = req.body.groupId;
		const description = req.body.description ? req.body.description : "";

		if (!groupId) {
			res.json({
				success: false,
				message: "groupId param is required"
			});
			return;
		} else if (!title) {
			res.json({
				success: false,
				message: "title cannot be empty"
			});
			return;
		} else {
			this.isAdmin(groupId, username).then(result => {
				if (result) {
					const updateGroupQuery = {
						text:
							"UPDATE groups SET title=$1, description=$2 where group_id=$3",
						values: [title, description, groupId]
					};

					client
						.query(updateGroupQuery)
						.then(result => {
							res.json({
								success: true,
								message: "group updated successfully"
							});
							return;
						})
						.catch(error => {
							console.log(error);
							res.json({
								success: false,
								message: "error updating group",
								error: error
							});
							return;
						});
				} else {
					res.json({
						success: false,
						message: "current user cannot edit that group"
					});
					return;
				}
			});
		}
	}

	deleteGroup(req, res) {
		const username = req.decoded;
		const groupId = req.body.groupId;

		if (!groupId) {
			res.json({
				success: false,
				message: "groupId cannot be empty"
			});

			return;
		}

		this.isAdmin(groupId, username)
			.then(result => {
				if (result) {
					const query = {
						text: "DELETE FROM groups WHERE group_id = $1",
						values: [groupId]
					};

					client
						.query(query)
						.then(result => {
							res.json({
								success: true,
								message: "group deleted successfully"
							});
						})
						.catch(error => {
							console.log(error);
							res.json({
								success: false,
								message: "error deleting group",
								error: error
							});
						});
				} else {
					res.json({
						success: false,
						message: "current user cannot delete that group"
					});
					return;
				}
			})
			.catch(error => {
				console.log(error);
				res.json({
					success: false,
					message: "error deleting group",
					error: error
				});
			});
	}

	addAdmin(req, res) {
		const username = req.decoded;
		const group_id = req.body.group_id;
		const adminArr = req.body.admins ? req.body.admins : [];
		if (!group_id) {
			res.json({
				success: false,
				message: "group_id cannot be empty"
			});
			return;
		}
		if (
			!Object.prototype.toString.call(adminArr) === "[object Array]" ||
			adminArr.length === 0
		) {
			res.json({
				success: false,
				message: "admins must be an array"
			});
			return;
		}
		this.isAdmin(group_id, username).then(result => {
			if (result) {
				for (let i = 0; i < adminArr.length; i++) {
					let admin = adminArr[i];
					if (result) {
						const query = {
							text: "INSERT INTO admins(username, group_id) values($1, $2)",
							values: [admin, group_id]
						};

						client
							.query(query)
							.then(result => {
								if (i === adminArr.length - 1) {
									res.json({
										success: true,
										message: "admins added successefully"
									});
								}
							})
							.catch(error => {
								console.log(error);
							});
					}
				}
			}
		});
	}
	//HELPERS:
	isAdmin(groupId, username) {
		const query = {
			text: "SELECT * FROM admins WHERE username=$1 AND group_id=$2",
			values: [username, groupId]
		};
		return client
			.query(query)
			.then(result => {
				if (result.rows[0]) {
					return true;
				} else {
					return false;
				}
			})
			.catch(error => {
				console.log(error);
				res.json({
					success: false,
					message: "error checking if user is admin of group",
					error: error
				});
				return false;
			});
	}
}

const groupHandler = new GroupHandler();

module.exports = {
	groupHandler: groupHandler
};
