import React from 'react'

export default function DashboardSummary({ salesData, inventoryData }) {
  const totalSales = salesData.reduce((sum, sale) => sum + sale.quantitySold, 0)
  const totalInventory = inventoryData.reduce((sum, item) => sum + item.quantity, 0)
  const activeCategories = [...new Set(inventoryData.map(item => item.categoryId))].length
  const outOfStockItems = inventoryData.filter(item => item.quantity <= 0).length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-white p-4 rounded-lg shadow-sm border-l-2 border-blue-500">
        <h3 className="text-xs text-gray-500">Total Sales</h3>
        <p className="text-xl font-bold">{totalSales}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border-l-2 border-green-500">
        <h3 className="text-xs text-gray-500">Total Inventory</h3>
        <p className="text-xl font-bold">{totalInventory}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border-l-2 border-purple-500">
        <h3 className="text-xs text-gray-500">Categories</h3>
        <p className="text-xl font-bold">{activeCategories}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border-l-2 border-red-500">
        <h3 className="text-xs text-gray-500">Out of Stock</h3>
        <p className="text-xl font-bold">{outOfStockItems}</p>
      </div>
    </div>
  )
}
