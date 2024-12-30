import React, { useState, useEffect } from 'react'

export default function EditSaleModal({ isOpen, onClose, onSubmit, sale, inventoryItems }) {
  const [editedSale, setEditedSale] = useState(sale)

  useEffect(() => {
    setEditedSale(sale)
  }, [sale])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!editedSale.itemName || editedSale.quantitySold <= 0) {
      alert('Please fill all fields correctly')
      return
    }

    onSubmit(editedSale)
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${!isOpen && 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Sale</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <select
              value={editedSale?.itemName || ''}
              onChange={(e) => setEditedSale({ ...editedSale, itemName: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Item</option>
              {inventoryItems.map((item) => (
                <option key={item.id} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Sold</label>
            <input
              type="number"
              value={editedSale?.quantitySold || 0}
              onChange={(e) => setEditedSale({ ...editedSale, quantitySold: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Date</label>
            <input
              type="date"
              value={editedSale?.saleDate || ''}
              onChange={(e) => setEditedSale({ ...editedSale, saleDate: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
