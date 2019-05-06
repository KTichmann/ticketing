const express = require("express");
const groupHandlerExports = require("../handlers/groupHandler.js");
const middleware = require("../middleware.js");
const groupHandler = groupHandlerExports.groupHandler;

const groupRouter = express.Router();

groupRouter.get("/list", middleware.checkToken, groupHandler.listGroups);

groupRouter.post("/create", middleware.checkToken, groupHandler.createGroup);

groupRouter.post("/update", middleware.checkToken, groupHandler.updateGroup);

groupRouter.post("/delete", middleware.checkToken, groupHandler.deleteGroup);

groupRouter.post("/add-admin", middleware.checkToken, groupHandler.addAdmin);
// groupRouter.post("/", middleware.checkToken, groupHandler.)

module.exports = groupRouter;
