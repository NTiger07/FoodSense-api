const express = require("express");
const router = express.Router();
const Item = require("../models/Item");


// @desc     Get all trash
// @route    GET  "/trash/all"

router.get("/all/:id", async (req, res) => {
  try {
    const items = await Item.find({ user: req.params.id, isTrash: true }).lean();
    res.send(items)
  } catch (error) {
    console.error(error)
    res.status(500)
  }

});

module.exports = router;