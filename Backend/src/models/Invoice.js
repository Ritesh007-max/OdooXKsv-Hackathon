const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
  poId: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
