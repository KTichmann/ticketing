const express = require("express");
const groupHandlerExports = require("../handlers/groupHandler.js");
const middleware = require("../middleware.js");
const groupHandler = groupHandlerExports.groupHandler;

const groupRouter = express.Router();

groupRouter.post("/create", middleware.checkToken, groupHandler.create);

module.exports = groupRouter;
