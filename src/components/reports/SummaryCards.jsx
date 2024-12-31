import React from 'react'

export default function SummaryCards({ salesData, inventoryData, stockData, dateRange }) {
  const totalSales = salesData.reduce((sum, sale) => sum + sale.quantitySold, 0)
  const totalInventoryIn = inventoryData.reduce((sum, item) => sum + item.quantity, 0)
  const totalInventoryOut = salesData.reduce((sum, sale) => sum + sale.quantitySold, 0)
  const outOfStockCount = stockData.filter(item => item.quantity <= 0).length
  const lowStockCount = stockData.filter(item => item.quantity > 0 && item.quantity < 10).length

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm text-gray-500">Total Sales</h3>
        <p className="text-xl font-bold">{totalSales}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm text-gray-500">Inventory In</h3>
        <p className="text-xl font-bold">{totalInventoryIn}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm text-gray-500">Inventory Out</h3>
        <p className="text-xl font-bold">{totalInventoryOut}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm text-gray-500">Out of Stock</h3>
        <p className="text-xl font-bold text-red-600">{outOfStockCount}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm text-gray-500">Low Stock</h3>
        <p className="text-xl font-bold text-yellow-600">{lowStockCount}</p>
      </div>
    </div>
  )
}
