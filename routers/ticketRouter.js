const express = require("express");
const ticketHandlerExports = require("../handlers/ticketHandler.js");
const middleware = require("../middleware.js");
const ticketHandler = ticketHandlerExports.ticketHandler;

const ticketRouter = express.Router();

ticketRouter.post("/create", ticketHandler.createTicket);

ticketRouter.post("/move", middleware.checkToken, ticketHandler.moveTicket);

ticketRouter.post("/delete", middleware.checkToken, ticketHandler.deleteTicket);

// ticketRouter.post("/", middleware.checkToken, ticketRouter.)

module.exports = ticketRouter;

//Ticket Actions:
//Create
//Update
//Delete
//Get ticket by id

//Ticket Qualities:
// - ID
// - Title
// - Description
// - Date Created
// - Status
// - group_id

//TODO:
//Ticket comments & responses
//Notify reporter @ reporter_email
