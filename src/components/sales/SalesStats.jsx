import React from 'react'

export default function SalesStats({ sales, dateRange }) {
  const totalSales = sales.length
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0)
  const totalItemsSold = sales.reduce((sum, sale) => sum + sale.quantitySold, 0)
  const averageSaleValue = totalRevenue / (totalSales || 1)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Total Sales</p>
        <p className="text-2xl font-bold text-gray-800">{totalSales}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Total Revenue</p>
        <p className="text-2xl font-bold text-gray-800">₹{totalRevenue.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Items Sold</p>
        <p className="text-2xl font-bold text-gray-800">{totalItemsSold}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Avg. Sale Value</p>
        <p className="text-2xl font-bold text-gray-800">₹{averageSaleValue.toFixed(2)}</p>
      </div>
    </div>
  )
}
