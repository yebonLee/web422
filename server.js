const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

//middleware
app.use(express.json());
app.use(cors());

//ensure that the environment is set up correctly and tun the test the server locally
app.get("/", (req, res) => {
    res.json({message:"API Listening"});
})