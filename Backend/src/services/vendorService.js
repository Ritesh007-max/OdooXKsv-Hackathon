const { Vendor } = require("../models");

function getVendors() {
  return Vendor.find()
    .sort({ createdAt: -1 })
    .populate("userId", "name email role")
    .lean();
}

async function addVendor(data) {
  const mongoose = require("mongoose");
  const id = new mongoose.Types.ObjectId().toString();
  const vendor = new Vendor({
    _id: id,
    name: data.name,
    gst: data.gst,
    contact: data.contact,
    category: data.category,
    status: data.status || "Active",
    userId: data.userId || "USER_ID"
  });
  return await vendor.save();
}

async function updateVendor(id, data) {
  return await Vendor.findByIdAndUpdate(
    id,
    {
      name: data.name,
      gst: data.gst,
      contact: data.contact,
      category: data.category,
      status: data.status,
    },
    { new: true }
  );
}

async function deleteVendor(id) {
  return await Vendor.findByIdAndDelete(id);
}

module.exports = {
  getVendors,
  addVendor,
  updateVendor,
  deleteVendor,
};
