import React, { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'
import Sidebar from '../components/Sidebar'
import InventoryHeader from '../components/inventory/InventoryHeader'
import InventoryStats from '../components/inventory/InventoryStats'
import InventoryTable from '../components/inventory/InventoryTable'
import AddInventoryModal from '../components/inventory/AddInventoryModal'
import EditInventoryModal from '../components/inventory/EditInventoryModal'

export default function InventoryManagement() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [inventory, setInventory] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch categories
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categoriesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setCategories(categoriesData)
    })
    return () => unsubscribe()
  }, [])

  // Fetch inventory
  useEffect(() => {
    if (selectedCategory) {
      const unsubscribe = onSnapshot(
        collection(db, `categories/${selectedCategory}/items`),
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          setInventory(items)
        }
      )
      return () => unsubscribe()
    }
  }, [selectedCategory])

  // Pagination and filtering
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage)

  const handleAddItem = async (item) => {
    try {
      let fileUrl = ''
      if (item.file) {
        const fileRef = ref(storage, `purchase-bills/${item.file.name}`)
        await uploadBytes(fileRef, item.file)
        fileUrl = await getDownloadURL(fileRef)
      }

      await addDoc(collection(db, `categories/${item.category}/items`), {
        ...item,
        fileUrl,
        createdAt: new Date()
      })
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleUpdateItem = async (item) => {
    try {
      await updateDoc(doc(db, `categories/${item.category}/items`, item.id), item)
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, `categories/${selectedCategory}/items`, itemId))
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6">
        <InventoryHeader 
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onAddClick={() => setIsAddModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="mt-4">
          <InventoryStats inventory={inventory} />
        </div>

        <div className="mt-4 bg-white rounded-lg shadow-sm">
          <InventoryTable
            inventory={currentItems}
            onEdit={(item) => {
              setEditingItem(item)
              setIsEditModalOpen(true)
            }}
            onDelete={handleDeleteItem}
          />
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredInventory.length)} of {filteredInventory.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm bg-gray-100 rounded-md">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <AddInventoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddItem}
          categories={categories}
        />

        <EditInventoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateItem}
          item={editingItem}
          categories={categories}
        />
      </div>
    </div>
  )
}
