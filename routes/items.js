const express = require("express");
const router = express.Router();
const Item = require("../models/Item");



// @desc     Get all items
// @route    GET  "/items/all"

router.get("/all", async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      items
    });
  } catch (error) {
    console.error(error)
    res.status(500)
  }

});


// @desc     Update item
// @route    PUT  "/items/:id"

router.put("/:id", async (req, res) => {
  try {
    let item = await Item.findById(req.params.id).lean();

    if (!item) {
      return res.render("error/404");
    }

    if (item.user !== req.user.id) {
      res.redirect("/");
    } else {
      story = await Item.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/dashboard");
    }
  } catch (error) {
    console.error(error);
  }
});


// @desc     Delete item
// @route    DELETE  "/items/:id"

router.delete("/:id", async (req, res) => {
  try {
    await Item.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

module.exports = router;
