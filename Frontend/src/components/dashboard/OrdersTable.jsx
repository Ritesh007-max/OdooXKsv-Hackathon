import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../api';

const getStatusStyles = (status = '') => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'sent':
      return 'text-green-600 bg-green-50';
    case 'pending':
    case 'pending_approval':
      return 'text-orange-600 bg-orange-50';
    case 'draft':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const getStatusDot = (status = '') => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'sent':
      return 'bg-green-500';
    case 'pending':
    case 'pending_approval':
      return 'bg-orange-500';
    case 'draft':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/dashboard/recent-pos')
      .then((data) => {
        setOrders(data.purchaseOrders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch recent purchase orders:', err);
        setLoading(false);
      });
  }, []);

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
            {loading ? (
              <tr>
                <td colSpan="4" className="px-5 py-6 text-center text-body font-sans text-gray-400">
                  Loading recent orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-5 py-6 text-center text-body font-sans text-gray-400">
                  No recent orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => {
                const poNumber = typeof order._id === 'string' && order._id.length > 8
                  ? `PO-${order._id.substring(0, 8).toUpperCase()}`
                  : `PO-${order._id}`;
                return (
                  <tr 
                    key={order._id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === orders.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-5 py-3 text-body font-mono text-gray-900 font-medium">
                      {poNumber}
                    </td>
                    <td className="px-5 py-3 text-body font-sans text-gray-600">
                      {order.vendorId?.name || 'Unknown Vendor'}
                    </td>
                    <td className="px-5 py-3 text-body font-mono text-gray-900 text-right">
                      ${order.total?.toLocaleString() || 0}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${getStatusDot(order.status)}`}></span>
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-sans font-medium ${getStatusStyles(order.status)}`}>
                          {order.status || 'unknown'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
