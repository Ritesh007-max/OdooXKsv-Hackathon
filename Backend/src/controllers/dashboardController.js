const dashboardService = require("../services/dashboardService");

async function getDashboardOverview(req, res, next) {
  try {
    const overview = await dashboardService.getOverview();

    res.json(overview);
  } catch (error) {
    next(error);
  }
}

async function getRecentRfqs(req, res, next) {
  try {
    const rfqs = await dashboardService.getRecentRfqs();

    res.json({ rfqs });
  } catch (error) {
    next(error);
  }
}

async function getRecentInvoices(req, res, next) {
  try {
    const invoices = await dashboardService.getRecentInvoices();

    res.json({ invoices });
  } catch (error) {
    next(error);
  }
}

async function getRecentPurchaseOrders(req, res, next) {
  try {
    const purchaseOrders = await dashboardService.getRecentPurchaseOrders();

    res.json({ purchaseOrders });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getDashboardOverview,
  getRecentRfqs,
  getRecentInvoices,
  getRecentPurchaseOrders,
};
