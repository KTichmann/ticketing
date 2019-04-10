const express = require("express");
const userHandlerExports = require("../handlers/UserHandler");
const userHandler = userHandlerExports.userHandler;

const userRouter = express.Router();

userRouter.post("/sign-up", userHandler.signUp);

userRouter.post("/authenticate", userHandler.authenticate);

userRouter.get("/verify/:hash", userHandler.verify);

module.exports = userRouter;
