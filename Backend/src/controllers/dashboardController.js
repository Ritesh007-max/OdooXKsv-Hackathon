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

async function getInvoices(req, res, next) {
  try {
    const invoices = await dashboardService.getInvoices();

    res.json({ invoices });
  } catch (error) {
    next(error);
  }
}

async function getPurchaseOrders(req, res, next) {
  try {
    const purchaseOrders = await dashboardService.getPurchaseOrders();

    res.json({ purchaseOrders });
  } catch (error) {
    next(error);
  }
}

async function getQuotations(req, res, next) {
  try {
    const quotations = await dashboardService.getQuotations();

    res.json({ quotations });
  } catch (error) {
    next(error);
  }
}

async function getRfqs(req, res, next) {
  try {
    const rfqs = await dashboardService.getRfqs();

    res.json({ rfqs });
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await dashboardService.getUsers();

    res.json({ users });
  } catch (error) {
    next(error);
  }
}

async function getVendors(req, res, next) {
  try {
    const vendors = await dashboardService.getVendors();

    res.json({ vendors });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getDashboardOverview,
  getRecentRfqs,
  getRecentInvoices,
  getRecentPurchaseOrders,
  getInvoices,
  getPurchaseOrders,
  getQuotations,
  getRfqs,
  getUsers,
  getVendors
};
