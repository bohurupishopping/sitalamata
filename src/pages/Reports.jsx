import React from 'react'
    import Sidebar from '../components/Sidebar'
    import ChartComponent from '../components/ChartComponent'

    export default function Reports() {
      return (
        <div className="min-h-screen bg-gray-100 flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold mb-6">Reports</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Inventory and Sales Trends</h2>
              <ChartComponent />
            </div>
          </div>
        </div>
      )
    }
