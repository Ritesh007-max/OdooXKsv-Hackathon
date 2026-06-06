export const rfqDetails = {
  id: "RFQ-2024-0012",
  name: "Office Furniture Procurement Q2",
  deadline: "2024-07-15",
  status: "Closed"
};

export const quotationsMock = [
  {
    id: "Q-101",
    vendorName: "ErgoWorkspace Ltd",
    grandTotal: 145000,
    gstPercent: 18,
    deliveryTime: "14 Days",
    vendorRating: 4.5,
    paymentTerms: "Net 30",
    status: "Submitted"
  },
  {
    id: "Q-102",
    vendorName: "Furniture Plus",
    grandTotal: 132000, // Lowest
    gstPercent: 18,
    deliveryTime: "21 Days",
    vendorRating: 4.2,
    paymentTerms: "Net 15",
    status: "Submitted"
  },
  {
    id: "Q-103",
    vendorName: "Premium Office Supplies",
    grandTotal: 158000,
    gstPercent: 18,
    deliveryTime: "7 Days",
    vendorRating: 4.8,
    paymentTerms: "50% Advance",
    status: "Submitted"
  }
];
