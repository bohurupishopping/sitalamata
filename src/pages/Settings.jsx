import React from 'react'
    import Sidebar from '../components/Sidebar'

    export default function Settings() {
      return (
        <div className="min-h-screen bg-gray-100 flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">User Profile and Preferences</h2>
              {/* Add settings form here */}
            </div>
          </div>
        </div>
      )
    }
