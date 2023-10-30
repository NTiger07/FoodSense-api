const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Item = require("../models/Item");

// @desc     Show add page
// @route    GET  "/items/add"

router.get("/add", ensureAuth, (req, res) => {
  res.render("items/add");
});

// @desc     Process Add form
// @route    POST  "/stories"

router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Item.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// @desc     Update item
// @route    PUT  "/items/:id"

router.put("/:id", ensureAuth, async (req, res) => {
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

router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Item.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

module.exports = router;
