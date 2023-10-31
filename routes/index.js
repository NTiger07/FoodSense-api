const express = require("express");
const router = express.Router();
const Item = require("../models/Item");


// @desc     Root
// @route    GET  "/"

router.get("/", async (req, res) => {
  res.send("Welcome to FoodSense")
});

module.exports = router;
