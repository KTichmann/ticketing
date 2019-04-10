const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const userRouter = require("./routers/userRouter");

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
	bodyParser.urlencoded({
		// to support URL-encoded bodies
		extended: true
	})
);

app.use(cors());

//user Routes
app.use("/user", userRouter);

//Spin up the server
app.listen(process.env.PORT, () => {
	console.log(`running at port: ${PORT}`);
});
