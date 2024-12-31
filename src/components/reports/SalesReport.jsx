import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function SalesReport({ salesData, dateRange }) {
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
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.05)',
        tension: 0.3,
        fill: true
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 12 },
        bodyFont: { size: 10 },
        padding: 8
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#e5e7eb' } }
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Sales Report</h2>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
