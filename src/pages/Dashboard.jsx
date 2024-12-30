import React from 'react'
    import Sidebar from '../components/Sidebar'
    import ChartComponent from '../components/ChartComponent'

    export default function Dashboard() {
      const inventoryData = {
        totalItems: 1234,
        availableStock: 1000,
        salesData: 234
      }

      return (
        <div className="min-h-screen bg-gray-100 flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Total Items</h2>
                <p className="text-3xl font-bold">{inventoryData.totalItems}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Available Stock</h2>
                <p className="text-3xl font-bold">{inventoryData.availableStock}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Sales Data</h2>
                <p className="text-3xl font-bold">{inventoryData.salesData}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Daily/Weekly Trends</h2>
              <ChartComponent />
            </div>
          </div>
        </div>
      )
    }
