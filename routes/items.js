const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// @desc     Get all items
// @route    GET  "/items/all"

router.get("/all/:id", async (req, res) => {
  try {
    const regexQuery = new RegExp(req.query.query, 'i')
    const items = await Item.find({
      itemName: {$regex: regexQuery},
      user: req.params.id,
      isTrash: false,
    })
      .sort({ expiryDate: req.query.order })
      .lean();
    res.send(items);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

// @desc     Add item
// @route    POST  "/items"

router.post("/:id", async (req, res) => {
  try {
    req.body.user = req.params.id;
    await Item.create(req.body);
    res.send("Item Added");
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

// @desc     Update item
// @route    PUT  "/items/:id"

router.put("/:id", async (req, res) => {
  try {
    let item = await Item.findById(req.params.id).lean();

    if (!item) {
      return res.status(404).send("Item not found");
    }

    item = await Item.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).send(item);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// @desc     Trash item
// @route    POST  "/items/trash/:id"

router.post("/trash/:id&:type", async (req, res) => {
  try {
    let item = await Item.findById(req.params.id).lean();

    if (!item) {
      return res.status(404).send("Item not found");
    }
    const date = new Date();
    item = await Item.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isTrash: true, trashType: req.params.type, createdAt: date } },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).send(item);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// @desc     Delete item
// @route    DELETE  "/items/:id"

router.delete("/:id", async (req, res) => {
  try {
    await Item.deleteOne({ _id: req.params.id });
    return res.status(200).send("Item Deleted");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
