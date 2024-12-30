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

  // Add new item
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

  // Update item
  const handleUpdateItem = async (item) => {
    try {
      await updateDoc(doc(db, `categories/${item.category}/items`, item.id), item)
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  // Delete item
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
      <div className="flex-1 p-4 md:p-6 overflow-x-auto">
        <InventoryHeader 
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onAddClick={() => setIsAddModalOpen(true)}
        />

        <div className="mt-4">
          <InventoryStats inventory={inventory} />
        </div>

        <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
          <div className="p-4">
            <InventoryTable
              inventory={inventory}
              onEdit={(item) => {
                setEditingItem(item)
                setIsEditModalOpen(true)
              }}
              onDelete={handleDeleteItem}
            />
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
