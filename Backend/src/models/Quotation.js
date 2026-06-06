const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema(
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
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryTime: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

quotationSchema.index({ rfqId: 1, vendorId: 1 }, { unique: true });

module.exports = mongoose.model("Quotation", quotationSchema);
