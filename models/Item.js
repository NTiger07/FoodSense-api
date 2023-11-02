const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isTrash: {
    type: Boolean,
    required: true,
    default: false,
  },
  itemId: {
    type: Number,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  units: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  itemNotes: {
    type: String,
    required: false,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Item", ItemSchema);
