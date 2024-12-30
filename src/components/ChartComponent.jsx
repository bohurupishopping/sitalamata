import React from 'react'
    import { Line } from 'react-chartjs-2'
    import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

    export default function ChartComponent() {
      const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Inventory',
            data: [65, 59, 80, 81, 56, 55, 40],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      }

      return <Line data={data} />
    }
