import React from 'react';
import { mockOrderHistory } from '../mockData';

const OrderHistory = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Order History</h2>
      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Products</th>
              <th className="py-3 px-6 text-center">Total</th>
              <th className="py-3 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {mockOrderHistory.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">{order.id}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  <span>{order.date}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  <span>{order.products.join(', ')}</span>
                </td>
                <td className="py-3 px-6 text-center">
                  <span>${order.total.toFixed(2)}</span>
                </td>
                <td className="py-3 px-6 text-center">
                  <span className={`py-1 px-3 rounded-full text-xs ${
                    order.status === 'Delivered' ? 'bg-green-200 text-green-600' :
                    order.status === 'Processing' ? 'bg-yellow-200 text-yellow-600' :
                    'bg-red-200 text-red-600'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;

