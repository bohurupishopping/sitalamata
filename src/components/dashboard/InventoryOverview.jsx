import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function InventoryOverview({ inventoryData }) {
  const inventoryByCategory = inventoryData.reduce((acc, item) => {
    acc[item.categoryId] = (acc[item.categoryId] || 0) + item.quantity
    return acc
  }, {})

  const chartData = {
    labels: Object.keys(inventoryByCategory),
    datasets: [
      {
        label: 'Inventory',
        data: Object.values(inventoryByCategory),
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(129, 140, 248, 0.8)',
          'rgba(165, 180, 252, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          padding: 12,
          font: { size: 10 }
        }
      }
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm h-full">
      <h2 className="text-sm font-semibold mb-2">Inventory Distribution</h2>
      <div className="h-56">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  )
}
