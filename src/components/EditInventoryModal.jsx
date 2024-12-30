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
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Inventory</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={editedItem?.category || ''}
                onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Item Name *"
                value={editedItem?.name || ''}
                onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="date"
                value={editedItem?.purchaseDate || ''}
                onChange={(e) => setEditedItem({ ...editedItem, purchaseDate: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="number"
                placeholder="Quantity *"
                value={editedItem?.quantity || 0}
                onChange={(e) => setEditedItem({ ...editedItem, quantity: parseInt(e.target.value) })}
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Purchase Bill Number"
                value={editedItem?.billNumber || ''}
                onChange={(e) => setEditedItem({ ...editedItem, billNumber: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="file"
                onChange={(e) => setEditedItem({ ...editedItem, file: e.target.files[0] })}
                className="w-full p-2 border rounded-md"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }
