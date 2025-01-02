import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function SalesReport({ salesData, dateRange }) {
  // Group sales data by date
  const salesByDate = salesData.reduce((acc, sale) => {
    const date = sale.saleDate
    acc[date] = (acc[date] || 0) + sale.quantitySold
    return acc
  }, {})

  const chartData = {
    labels: Object.keys(salesByDate),
    datasets: [
      {
        label: 'Sales',
        data: Object.values(salesByDate),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Sales Report</h2>
      <div className="h-96">
        <Line data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  )
}
