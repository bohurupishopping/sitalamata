import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function StockChart({ closingStock }) {
  const chartData = {
    labels: closingStock.map(item => item.name),
    datasets: [
      {
        label: 'Stock Quantity',
        data: closingStock.map(item => item.quantity),
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderWidth: 0
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
      <h2 className="text-lg font-semibold mb-4">Stock Levels</h2>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
