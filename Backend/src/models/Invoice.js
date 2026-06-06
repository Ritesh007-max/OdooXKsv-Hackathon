const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: true,
      unique: true,
    },
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
    vendor: {
      name: { type: String, required: true },
      address: { type: String, required: true },
    },
    items: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 0 },
        unitPrice: { type: Number, required: true, min: 0 },
        tax: { type: Number, required: true, min: 0, default: 0 },
      }
    ],
    status: {
      type: String,
      enum: ["Draft", "Pending", "Paid", "Overdue"],
      default: "Draft",
    },
    dates: {
      invoiceDate: { type: String, required: true },
      dueDate: { type: String, required: true },
      paymentTerms: { type: String, required: true, default: "Net 30" },
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    logs: [
      {
        timestamp: { type: String, required: true },
        level: { type: String, required: true },
        user: { type: String, required: true },
        message: { type: String, required: true },
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
