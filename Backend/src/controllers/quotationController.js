const quotationService = require("../services/quotationService");

async function getQuotations(req, res, next) {
  try {
    const quotations = await quotationService.getQuotations();
    res.json({ quotations });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getQuotations,
};
