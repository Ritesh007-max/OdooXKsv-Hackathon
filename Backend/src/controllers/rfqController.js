const rfqService = require("../services/rfqService");

async function getRfqs(req, res, next) {
  try {
    const rfqs = await rfqService.getRfqs();
    res.json({ rfqs });
  } catch (error) {
    next(error);
  }
}

async function addRfq(req, res, next) {
  try {
    const rfq = await rfqService.addRfq(req.body);
    res.status(201).json({ rfq });
  } catch (error) {
    next(error);
  }
}

async function updateRfq(req, res, next) {
  try {
    const rfq = await rfqService.updateRfq(req.params.id, req.body);
    if (!rfq) {
      return res.status(404).json({ message: "RFQ not found" });
    }
    res.json({ rfq });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRfqs,
  addRfq,
  updateRfq,
};
