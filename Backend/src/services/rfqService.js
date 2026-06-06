const { RFQ, User } = require("../models");

function getRfqs() {
  return RFQ.find()
    .sort({ createdAt: -1 })
    .populate("vendors", "name category contact")
    .populate("createdBy", "name email role")
    .lean();
}

async function addRfq(data) {
  const mongoose = require("mongoose");
  let creatorId = data.createdBy;
  if (!creatorId) {
    const defaultUser = await User.findOne({ role: { $in: ["admin", "officer", "manager"] } });
    if (defaultUser) {
      creatorId = defaultUser._id;
    } else {
      const anyUser = await User.findOne({});
      creatorId = anyUser ? anyUser._id : new mongoose.Types.ObjectId();
    }
  }
  const id = new mongoose.Types.ObjectId().toString();
  const rfq = new RFQ({
    _id: id,
    title: data.title,
    product: data.product,
    quantity: data.quantity,
    deadline: new Date(data.deadline),
    vendors: data.vendors || [],
    status: data.status || "draft",
    createdBy: creatorId,
    category: data.category,
    description: data.description,
  });
  return await rfq.save();
}

async function updateRfq(id, data) {
  return await RFQ.findByIdAndUpdate(
    id,
    {
      title: data.title,
      product: data.product,
      quantity: data.quantity,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      vendors: data.vendors,
      status: data.status,
      category: data.category,
      description: data.description,
    },
    { new: true, omitUndefined: true }
  );
}

module.exports = {
  getRfqs,
  addRfq,
  updateRfq,
};
