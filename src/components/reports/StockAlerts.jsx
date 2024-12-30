import React from 'react'

export default function StockAlerts({ stockData }) {
  const outOfStock = stockData.filter(item => item.quantity <= 0)
  const lowStock = stockData.filter(item => item.quantity > 0 && item.quantity < 10)

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Stock Alerts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-md font-medium mb-2 text-red-600">Out of Stock</h3>
          <ul className="space-y-1">
            {outOfStock.map((item, index) => (
              <li key={index} className="text-sm">{item.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-md font-medium mb-2 text-yellow-600">Low Stock</h3>
          <ul className="space-y-1">
            {lowStock.map((item, index) => (
              <li key={index} className="text-sm">{item.name} ({item.quantity})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
