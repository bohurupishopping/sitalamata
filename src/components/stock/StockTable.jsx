import React from 'react'

export default function StockTable({ closingStock }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {closingStock.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-800">{item.category}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{item.name}</td>
              <td className={`px-6 py-4 text-sm ${
                item.quantity <= 0 ? 'text-red-600' : 
                item.quantity < 10 ? 'text-yellow-600' : 'text-gray-800'
              }`}>
                {item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
