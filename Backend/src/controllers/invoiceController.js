const invoiceService = require("../services/invoiceService");

async function getInvoices(req, res, next) {
  try {
    const invoices = await invoiceService.getInvoices();
    res.json({ invoices });
  } catch (error) {
    next(error);
  }
}

async function addInvoice(req, res, next) {
  try {
    const invoice = await invoiceService.addInvoice(req.body);
    res.status(201).json({ invoice });
  } catch (error) {
    next(error);
  }
}

async function updateInvoice(req, res, next) {
  try {
    const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json({ invoice });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getInvoices,
  addInvoice,
  updateInvoice,
};
