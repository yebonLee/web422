/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: ____Yebon Lee___ Student ID: ____132747205____ Date: ___2022.01.21___
 *
 *  Heroku Link:
 *
 ********************************************************************************/

const express = require("express");
const path = require("path");
const cors = require("cors");
const { query, validationResult } = require("express-validator");

const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB();

const data =
  "mongodb+srv://Yebon:qwerty123@cluster0.ixebn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

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
  res.json({ message: "API Listening" });
});

app.post("/api/restaurants", (req, res) => {
  db.addNewRestaurants(req.body)
    .then((data) => {
      res
        .status(201)
        .json({ message: "Successfully created a new restaurant." });
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to create a new restaurant." });
    });
});

// must accept page perPage borough
app.get(
  "/api/restaurants",
  [query("page").isInt({ min: 1 }), query("perPage").isInt({ min: 1 })],
  (req, res) => {
    const page = req.query.page;
    const perPage = req.query.perPge;
    const borough = req.query.borough;

    db.getAllRestaurants(page, perPage, borough).then((restaurants) => {});
  }
);

app.get("/api/restaurants/:id", (req, res) => {});

app.put("/api/restaurants/:id", (req, res) => {});

app.delete("/api/restaurants/:id", (req, res) => {
  if (req.params.id == req.body._id) {
    db.deleteRestaurantById(req.params.id)
      .then((data) => {
        res.status(201).json({ message: "Success to delete." });
      })
      .catch((err) => {
        res.status(500).json({ message: "Fail to delete." });
      });
  }
});
