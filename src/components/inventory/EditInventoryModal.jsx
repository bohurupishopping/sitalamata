import React, { useState, useEffect } from 'react'

export default function EditInventoryModal({ isOpen, onClose, onSubmit, item, categories }) {
  const [editedItem, setEditedItem] = useState(item)

  useEffect(() => {
    setEditedItem(item)
  }, [item])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(editedItem)
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${!isOpen && 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Inventory</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={editedItem?.category || ''}
              onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              placeholder="Item Name"
              value={editedItem?.name || ''}
              onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
            <input
              type="date"
              value={editedItem?.purchaseDate || ''}
              onChange={(e) => setEditedItem({ ...editedItem, purchaseDate: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              placeholder="Quantity"
              value={editedItem?.quantity || 0}
              onChange={(e) => setEditedItem({ ...editedItem, quantity: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
            <input
              type="text"
              placeholder="Bill Number"
              value={editedItem?.billNumber || ''}
              onChange={(e) => setEditedItem({ ...editedItem, billNumber: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Bill</label>
            <input
              type="file"
              onChange={(e) => setEditedItem({ ...editedItem, file: e.target.files[0] })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
