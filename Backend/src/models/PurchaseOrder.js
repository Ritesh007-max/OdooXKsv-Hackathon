const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
  {
    rfqId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFQ",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft", "issued", "completed", "cancelled"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
