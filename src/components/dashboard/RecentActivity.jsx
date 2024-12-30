import React from 'react'

export default function RecentActivity({ salesData, inventoryData }) {
  // Combine and sort recent activities
  const recentActivities = [
    ...salesData.map(sale => ({
      type: 'sale',
      date: sale.saleDate,
      item: sale.itemName,
      quantity: sale.quantitySold
    })),
    ...inventoryData.map(item => ({
      type: 'inventory',
      date: item.createdAt?.toDate().toISOString().split('T')[0] || '',
      item: item.name,
      quantity: item.quantity
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {recentActivities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'sale' ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              <div>
                <p className="text-sm font-medium">{activity.item}</p>
                <p className="text-xs text-gray-500">{activity.date}</p>
              </div>
            </div>
            <div className="text-sm">
              {activity.type === 'sale' ? 'Sold' : 'Added'} {activity.quantity} units
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
