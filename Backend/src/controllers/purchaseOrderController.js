const purchaseOrderService = require("../services/purchaseOrderService");

async function getPurchaseOrders(req, res, next) {
  try {
    const purchaseOrders = await purchaseOrderService.getPurchaseOrders();
    res.json({ purchaseOrders });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPurchaseOrders,
};
