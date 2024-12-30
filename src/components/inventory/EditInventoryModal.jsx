import React, { useState, useEffect } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase'

export default function EditInventoryModal({ isOpen, onClose, onSubmit, item, categories }) {
  const [editedItem, setEditedItem] = useState(item)
  const [filteredItems, setFilteredItems] = useState([])
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newItemName, setNewItemName] = useState('')

  // Fetch items based on selected category
  useEffect(() => {
    if (editedItem?.category) {
      const q = query(collection(db, 'items'), where('category', '==', editedItem.category))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const itemsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setFilteredItems(itemsData)
      })
      return () => unsubscribe()
    } else {
      setFilteredItems([])
    }
  }, [editedItem?.category])

  // Handle category change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value
    setEditedItem({ ...editedItem, category: categoryId, name: '' })
  }

  // Handle adding a new category
  const handleAddCategory = async () => {
    if (!newCategory) {
      alert('Please enter a category name')
      return
    }

    try {
      await addDoc(collection(db, 'categories'), {
        name: newCategory,
        totalStock: 0
      })
      setIsCategoryModalOpen(false)
      setNewCategory('')
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  // Handle adding a new item name
  const handleAddItemName = async () => {
    if (!newItemName) {
      alert('Please enter an item name')
      return
    }

    if (!editedItem.category) {
      alert('Please select a category first')
      return
    }

    try {
      await addDoc(collection(db, 'items'), {
        name: newItemName,
        category: editedItem.category
      })
      setIsItemModalOpen(false)
      setNewItemName('')
    } catch (error) {
      console.error('Error adding item name:', error)
    }
  }

  // Handle submitting the edited inventory item
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!editedItem.category || !editedItem.name || !editedItem.purchaseDate || editedItem.quantity <= 0) {
      alert('Please fill all required fields and ensure quantity > 0')
      return
    }
    onSubmit(editedItem)
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${!isOpen && 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Inventory</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <div className="flex items-center gap-2">
              <select
                value={editedItem?.category || ''}
                onChange={handleCategoryChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Item Name Selection */}
          {editedItem?.category && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <div className="flex items-center gap-2">
                <select
                  value={editedItem?.name || ''}
                  onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Item</option>
                  {filteredItems.map((item) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(true)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Purchase Date */}
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

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              placeholder="Enter quantity"
              value={editedItem?.quantity || 0}
              onChange={(e) => setEditedItem({ ...editedItem, quantity: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
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
              Save Changes
            </button>
          </div>
        </form>

        {/* Add Category Modal */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${!isCategoryModalOpen && 'hidden'}`}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Category</h2>
            <input
              type="text"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              required
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Add Item Name Modal */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${!isItemModalOpen && 'hidden'}`}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Item Name</h2>
            <input
              type="text"
              placeholder="Enter item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              required
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddItemName}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
