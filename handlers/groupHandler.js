const { Client } = require("pg");
const { DATABASE_URL, SECRET, PASS } = process.env;
const client = new Client({
  connectionString: DATABASE_URL
});

class GroupHandler {
  constructor() {
    client
      .connect()
      .catch(err => console.log("connection error: ", err.toString()));
  }

  create(req, res) {
    const username = req.decoded;
    const title = req.body.title;
    const criteria = req.body.criteria;
    console.log(criteria);
    const description = req.body.description ? req.body.description : "";
    //INSERT INTO comments (post_id, comment, username) VALUES ($1, $2, $3)
    const createGroupQuery = {
      text:
        "INSERT INTO groups (title, description, criteria) VALUES ($1, $2, $3) RETURNING group_id",
      values: [title, description, criteria]
    };
    console.log(createGroupQuery);
    if (!title) {
      res.json({
        success: false,
        message: "title is empty"
      });
    } else if (!Array.isArray(criteria)) {
      res.json({
        success: false,
        message: "criteria must be an array"
      });
    } else {
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
            })
            .catch(error => {
              res.json({
                success: false,
                message: "error adding user to group",
                error: error
              });
            });
        })
        .catch(error => {
          console.log(error);
          res.json({ success: false, message: "error creating group" });
        });
    }
  }
}

const groupHandler = new GroupHandler();

module.exports = {
  groupHandler: groupHandler
};
