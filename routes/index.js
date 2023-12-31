const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Item = require("../models/Item");

// @desc     Login/Landin page
// @route    GET  "/"

router.get("/", ensureGuest, (req, res) => {
  res.render("login");
});

// @desc     Dashboard
// @route    GET  "/dashboard"

router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      items
    });
  } catch (error) {
    console.error(error)
    res.render("error/500")
  }

});

module.exports = router;
