const vendorService = require("../services/vendorService");

async function getVendors(req, res, next) {
  try {
    const vendors = await vendorService.getVendors();
    res.json({ vendors });
  } catch (error) {
    next(error);
  }
}

async function addVendor(req, res, next) {
  try {
    const vendor = await vendorService.addVendor(req.body);
    res.status(201).json({ vendor });
  } catch (error) {
    next(error);
  }
}

async function updateVendor(req, res, next) {
  try {
    const vendor = await vendorService.updateVendor(req.params.id, req.body);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json({ vendor });
  } catch (error) {
    next(error);
  }
}

async function deleteVendor(req, res, next) {
  try {
    const vendor = await vendorService.deleteVendor(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json({ message: "Vendor deleted successfully", vendor });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getVendors,
  addVendor,
  updateVendor,
  deleteVendor,
};
