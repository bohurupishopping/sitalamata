import React from 'react'

export default function InventoryStats({ inventory }) {
  const totalItems = inventory.length
  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0)
  const lowStockItems = inventory.filter(item => item.quantity < 10).length
  const outOfStockItems = inventory.filter(item => item.quantity === 0).length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Total Items</p>
        <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Total Quantity</p>
        <p className="text-2xl font-bold text-gray-800">{totalQuantity}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Low Stock</p>
        <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Out of Stock</p>
        <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
      </div>
    </div>
  )
}
