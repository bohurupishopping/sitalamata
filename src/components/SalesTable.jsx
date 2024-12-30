import React from 'react'

export default function SalesTable({ sales }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Sales Records</h2>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Item Name</th>
            <th className="p-2 text-left">Quantity Sold</th>
            <th className="p-2 text-left">Sale Date</th>
          </tr>
        </thead>
        <tbody>
          {sales.length > 0 ? (
            sales.map((sale) => (
              <tr key={sale.id} className="border-b">
                <td className="p-2">{sale.itemName}</td>
                <td className="p-2">{sale.quantitySold}</td>
                <td className="p-2">{sale.saleDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-2 text-center">No sales records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
