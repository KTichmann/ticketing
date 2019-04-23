const { Client } = require("pg");
const { DATABASE_URL, SECRET, PASS } = process.env;
const client = new Client({
	connectionString: DATABASE_URL
});

class AdminHandler {}

const adminHandler = new AdminHandler();

module.exports = {
	adminHandler: adminHandler
};
