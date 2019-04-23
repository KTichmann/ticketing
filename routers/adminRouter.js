const express = require("express");
const adminHandlerExports = require("../handlers/adminHandler.js");
const middleware = require("../middleware.js");
const adminHandler = adminHandlerExports.adminHandler;

const adminRouter = express.Router();

adminRouter.post("/add", middleware.checkToken, adminHandler.addAdmin);

// adminRouter.post("/", middleware.checkToken, adminHandler.)

module.exports = groupRouter;
