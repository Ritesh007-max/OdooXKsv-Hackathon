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
    const rawInvoice = await invoiceService.addInvoice(req.body);
    const invoice = invoiceService.mapLegacyInvoice(rawInvoice.toObject ? rawInvoice.toObject() : rawInvoice);
    res.status(201).json({ invoice });
  } catch (error) {
    next(error);
  }
}

async function updateInvoice(req, res, next) {
  try {
    const rawInvoice = await invoiceService.updateInvoice(req.params.id, req.body);
    if (!rawInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    const invoice = invoiceService.mapLegacyInvoice(rawInvoice.toObject ? rawInvoice.toObject() : rawInvoice);
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
