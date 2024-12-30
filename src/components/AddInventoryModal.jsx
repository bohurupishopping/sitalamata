import React, { useState, useEffect } from 'react'
    import { addDoc, collection, onSnapshot } from 'firebase/firestore'
    import { db } from '../firebase'

    export default function AddInventoryModal({ isOpen, onClose, onSubmit }) {
      const [newItem, setNewItem] = useState({
        category: '',
        name: '',
        purchaseDate: '',
        quantity: 0,
        billNumber: '',
        file: null
      })
      const [categories, setCategories] = useState([])
      const [items, setItems] = useState([])
      const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
      const [isItemModalOpen, setIsItemModalOpen] = useState(false)
      const [newCategory, setNewCategory] = useState('')
      const [newItemName, setNewItemName] = useState('')

      // Fetch categories from Firestore
      useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
          const categoriesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          setCategories(categoriesData)
        })
        return () => unsubscribe()
      }, [])

      // Fetch item names from Firestore
      useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
          const itemsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          setItems(itemsData)
        })
        return () => unsubscribe()
      }, [])

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

        try {
          await addDoc(collection(db, 'items'), {
            name: newItemName
          })
          setIsItemModalOpen(false)
          setNewItemName('')
        } catch (error) {
          console.error('Error adding item name:', error)
        }
      }

      // Handle submitting the inventory item
      const handleSubmit = (e) => {
        e.preventDefault()
        if (!newItem.category || !newItem.name || !newItem.purchaseDate || newItem.quantity <= 0) {
          alert('Please fill all required fields and ensure quantity > 0')
          return
        }
        onSubmit(newItem)
      }

      return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${!isOpen && 'hidden'}`}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Add New Inventory</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="flex items-center gap-2">
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <div className="flex items-center gap-2">
                  <select
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Item</option>
                    {items.map((item) => (
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

              {/* Purchase Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                <input
                  type="date"
                  value={newItem.purchaseDate}
                  onChange={(e) => setNewItem({ ...newItem, purchaseDate: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Purchase Bill Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Bill Number (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter bill number"
                  value={newItem.billNumber}
                  onChange={(e) => setNewItem({ ...newItem, billNumber: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Purchase Bill (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setNewItem({ ...newItem, file: e.target.files[0] })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  Add Item
                </button>
              </div>
            </form>

            {/* Add Category Modal */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${!isCategoryModalOpen && 'hidden'}`}>
              <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Add New Category</h2>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6"
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
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Add New Item Name</h2>
                <input
                  type="text"
                  placeholder="Enter item name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6"
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
