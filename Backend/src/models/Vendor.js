const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gst: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "Active",
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vendor", vendorSchema);
