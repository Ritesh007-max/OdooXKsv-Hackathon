import React from 'react';

const orders = [
  { id: 'Po1', vendor: 'Infra', amount: '87000', status: 'Approved' },
  { id: 'Po2', vendor: 'Tech core', amount: '140000', status: 'Pending' },
  { id: 'Po3', vendor: 'OfficeNeed Co', amount: '34900', status: 'draft' },
];

const getStatusStyles = (status) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'text-green-600 bg-green-50';
    case 'pending':
      return 'text-orange-600 bg-orange-50';
    case 'draft':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const getStatusDot = (status) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-green-500';
    case 'pending':
      return 'bg-orange-500';
    case 'draft':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

const OrdersTable = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex-1">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-body-large font-sans font-bold text-gray-900">Recent Purchase Orders</h3>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-5 py-3 text-caption font-sans font-semibold text-gray-500 uppercase">PO#</th>
              <th className="px-5 py-3 text-caption font-sans font-semibold text-gray-500 uppercase">Vendor</th>
              <th className="px-5 py-3 text-caption font-sans font-semibold text-gray-500 uppercase text-right">Amount</th>
              <th className="px-5 py-3 text-caption font-sans font-semibold text-gray-500 uppercase text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr 
                key={order.id} 
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === orders.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="px-5 py-3 text-body font-mono text-gray-900 font-medium">
                  {order.id}
                </td>
                <td className="px-5 py-3 text-body font-sans text-gray-600">{order.vendor}</td>
                <td className="px-5 py-3 text-body font-mono text-gray-900 text-right">{order.amount}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${getStatusDot(order.status)}`}></span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-sans font-medium ${getStatusStyles(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
