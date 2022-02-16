/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: ____Yebon Lee___ Student ID: ____132747205____ Date: ___2022.01.21___
 *
 *  Heroku Link: https://ylee214weba1.herokuapp.com/
 *
 ********************************************************************************/

const express = require("express");
const path = require("path");
const cors = require("cors");
const { query } = require("express-validator");

const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB();

// use environment variable for the connection string
require("dotenv").config({ path: ".env" });
const { MONGODB_CONN_STRING } = process.env;
const data = process.env.MONGODB_CONN_STRING;

const app = express();
const HTTP_PORT = process.env.PORT || "8080";

// middleware
app.use(express.json());
app.use(cors());

// ensure that we can indeed to the mongodb atlas cluster with new connection string
db.initialize(data)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// ensure that the environment is set up correctly and tun the test the server locally
app.get("/", (req, res) => {
  // res.json({ message: "API Listening" });

  res.sendFile(path.join(__dirname, "./index.html"));
});

//201,404
app.post("/api/restaurants", (req, res) => {
  db.addNewRestaurant(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res
        .status(404)
        .json({ message: "Failed to create a new restaurant." + err.message });
    });
});

// must accept page perPage borough
// if error 400(client) vs 500(server) -- I think the message should be appeared in client page.
app.get(
  "/api/restaurants",
  [
    query("page").isInt({ min: 1 }),
    query("perPage").isInt({ min: 1 }),
    query("borough").isString(),
  ],
  async (req, res) => {
    const page = req.query.page;
    const perPage = req.query.perPage;
    const borough = req.query.borough;

    if (page != undefined || perPage != undefined) {
      res.json(await db.getAllRestaurants(page, perPage, borough));
    } else {
      res.status(400).json({ message: "Enter page and perPage" });
    }
  }
);

//200,404
app.get("/api/restaurants/:id", (req, res) => {
  db.getRestaurantById(req.params.id)
    .then((data) => {
      res.status(200).json({
        data,
      });
    })
    .catch((err) => {
      res.status(404).json({
        message:
          "Failed to bring the restaurant data under the id of " +
          req.params.id,
      });
    });
});

//200,404
app.put("/api/restaurants/:id", (req, res) => {
  db.updateRestaurantById(req.body, req.params.id)
    .then((data) => {
      res.status(200).json({ message: "Success to update new data" });
    })
    .catch((err) => {
      res.status(404).json({ message: "Failed to update new data" });
    });
});

//204,404
app.delete("/api/restaurants/:id", (req, res) => {
  if (req.params.id == req.body._id) {
    db.deleteRestaurantById(req.params.id)
      .then((data) => {
        res.status(204).json({ message: "Success to delete." });
      })
      .catch((err) => {
        res.status(404).json({ message: "Failed to delete." });
      });
  }
});

app.use((req, res) => {
  res.status(404).send("Resource not found");
});
