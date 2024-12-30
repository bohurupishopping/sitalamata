import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function SalesTrendChart({ salesData }) {
  const salesByWeek = salesData.reduce((acc, sale) => {
    const date = new Date(sale.saleDate)
    const week = `Week ${Math.ceil(date.getDate() / 7)}`
    acc[week] = (acc[week] || 0) + sale.quantitySold
    return acc
  }, {})

  const chartData = {
    labels: Object.keys(salesByWeek),
    datasets: [
      {
        label: 'Sales',
        data: Object.values(salesByWeek),
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
    <div className="bg-white p-4 rounded-lg shadow-sm h-full">
      <h2 className="text-sm font-semibold mb-2">Sales Trend</h2>
      <div className="h-56">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
