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

async function addVendor(req, res, next) {
  try {
    const vendor = await dashboardService.addVendor(req.body);
    res.status(201).json({ vendor });
  } catch (error) {
    next(error);
  }
}

async function updateVendor(req, res, next) {
  try {
    const vendor = await dashboardService.updateVendor(req.params.id, req.body);
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
    const vendor = await dashboardService.deleteVendor(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json({ message: "Vendor deleted successfully", vendor });
  } catch (error) {
    next(error);
  }
}

async function addInvoice(req, res, next) {
  try {
    const invoice = await dashboardService.addInvoice(req.body);
    res.status(201).json({ invoice });
  } catch (error) {
    next(error);
  }
}

async function updateInvoice(req, res, next) {
  try {
    const invoice = await dashboardService.updateInvoice(req.params.id, req.body);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json({ invoice });
  } catch (error) {
    next(error);
  }
}

async function addRfq(req, res, next) {
  try {
    const rfq = await dashboardService.addRfq(req.body);
    res.status(201).json({ rfq });
  } catch (error) {
    next(error);
  }
}

async function updateRfq(req, res, next) {
  try {
    const rfq = await dashboardService.updateRfq(req.params.id, req.body);
    if (!rfq) {
      return res.status(404).json({ message: "RFQ not found" });
    }
    res.json({ rfq });
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
  getVendors,
  addVendor,
  updateVendor,
  deleteVendor,
  addInvoice,
  updateInvoice,
  addRfq,
  updateRfq
};
