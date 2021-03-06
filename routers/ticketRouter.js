const express = require("express");
const ticketHandlerExports = require("../handlers/ticketHandler.js");
const middleware = require("../middleware.js");
const ticketHandler = ticketHandlerExports.ticketHandler;

const ticketRouter = express.Router();

ticketRouter.get(
	"/list/:group_id",
	middleware.checkToken,
	ticketHandler.getTickets
);

ticketRouter.post("/create", ticketHandler.createTicket);

ticketRouter.put("/move", middleware.checkToken, ticketHandler.moveTicket);

ticketRouter.delete(
	"/delete",
	middleware.checkToken,
	ticketHandler.deleteTicket
);

ticketRouter.post("/comment", ticketHandler.commentOnTicket);
ticketRouter.post(
	"/admin-comment",
	middleware.checkToken,
	ticketHandler.adminComment
);

ticketRouter.get("/comments/:ticket_id", ticketHandler.getComments);

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
