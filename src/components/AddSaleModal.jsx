import React, { useState } from 'react'

export default function AddSaleModal({ isOpen, onClose, onSubmit, inventoryItems }) {
  const [newSale, setNewSale] = useState({
    itemName: '',
    quantitySold: 0
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newSale.itemName || newSale.quantitySold <= 0) {
      alert('Please select an item and enter a valid quantity')
      return
    }
    onSubmit(newSale)
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${!isOpen && 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Add New Sale</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <select
              value={newSale.itemName}
              onChange={(e) => setNewSale({ ...newSale, itemName: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Item</option>
              {inventoryItems.map((item) => (
                <option key={item.id} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>

          {/* Quantity Sold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Sold</label>
            <input
              type="number"
              placeholder="Enter quantity sold"
              value={newSale.quantitySold}
              onChange={(e) => setNewSale({ ...newSale, quantitySold: parseInt(e.target.value) })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              min="1"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
