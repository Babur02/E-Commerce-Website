const express = require('express');
const { config } = require("dotenv");
const paymentRoute = require("./routes/paymentRoutes.js");
const cors = require("cors");
config({ path: "./config/config.env" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", paymentRoute);

app.get("/api/getkey", function(req, res) {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
});

module.exports = app;
