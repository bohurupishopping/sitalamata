import React from 'react'

export default function BestSellers({ salesData }) {
  // Group sales by item
  const salesByItem = salesData.reduce((acc, sale) => {
    acc[sale.itemName] = (acc[sale.itemName] || 0) + sale.quantitySold
    return acc
  }, {})

  // Sort by quantity sold
  const sortedItems = Object.entries(salesByItem)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Best Selling Products</h2>
      <ul className="space-y-2">
        {sortedItems.map(([item, quantity], index) => (
          <li key={index} className="flex justify-between">
            <span>{item}</span>
            <span className="font-medium">{quantity} sold</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
