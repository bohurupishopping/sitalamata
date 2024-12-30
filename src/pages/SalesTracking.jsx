import React, { useState } from 'react'
    import Sidebar from '../components/Sidebar'
    import DataTable from '../components/DataTable'

    export default function SalesTracking() {
      const [sales, setSales] = useState([])
      const [newSale, setNewSale] = useState({ itemName: '', salesDate: '', quantitySold: 0 })

      const handleAddSale = () => {
        setSales([...sales, newSale])
        setNewSale({ itemName: '', salesDate: '', quantitySold: 0 })
      }

      return (
        <div className="min-h-screen bg-gray-100 flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold mb-6">Sales Tracking</h1>
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Add New Sale</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newSale.itemName}
                  onChange={(e) => setNewSale({ ...newSale, itemName: e.target.value })}
                  className="p-2 border rounded-md"
                />
                <input
                  type="date"
                  value={newSale.salesDate}
                  onChange={(e) => setNewSale({ ...newSale, salesDate: e.target.value })}
                  className="p-2 border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Quantity Sold"
                  value={newSale.quantitySold}
                  onChange={(e) => setNewSale({ ...newSale, quantitySold: parseInt(e.target.value) })}
                  className="p-2 border rounded-md"
                />
              </div>
              <button
                onClick={handleAddSale}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Sale
              </button>
            </div>
            <DataTable data={sales} />
          </div>
        </div>
      )
    }
