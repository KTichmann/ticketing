const express = require("express");
const userHandlerExports = require("../handlers/userHandler");
const userHandler = userHandlerExports.userHandler;

const userRouter = express.Router();

userRouter.post("/sign-up", userHandler.signUp);

userRouter.post("/authenticate", userHandler.authenticate);

userRouter.get("/verify/:hash", userHandler.verify);

userRouter.get("/check-user/:user", userHandler.checkUser);

module.exports = userRouter;
