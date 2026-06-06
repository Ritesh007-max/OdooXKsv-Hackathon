const mongoose = require("mongoose");

const rfqSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    product: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    deadline: {
      type: Date,
      required: true,
    },
    vendors: [
      {
        type: mongoose.Schema.Types.Mixed,
        ref: "Vendor",
      },
    ],
    category: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "open", "closed", "awarded", "cancelled"],
      default: "draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RFQ", rfqSchema);
