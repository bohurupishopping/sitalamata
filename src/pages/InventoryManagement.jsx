import React, { useState, useEffect } from 'react'
    import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore'
    import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
    import { db, storage } from '../firebase'
    import Sidebar from '../components/Sidebar'
    import AddInventoryModal from '../components/AddInventoryModal'
    import EditInventoryModal from '../components/EditInventoryModal'
    import CategoryOverview from '../components/CategoryOverview'
    import InventoryTable from '../components/InventoryTable'

    export default function InventoryManagement() {
      const [categories, setCategories] = useState([])
      const [selectedCategory, setSelectedCategory] = useState(null)
      const [inventory, setInventory] = useState([])
      const [isAddModalOpen, setIsAddModalOpen] = useState(false)
      const [isEditModalOpen, setIsEditModalOpen] = useState(false)
      const [editingItem, setEditingItem] = useState(null)

      // Fetch categories and inventory
      useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
          const categoriesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          setCategories(categoriesData)
        })
        return () => unsubscribe()
      }, [])

      useEffect(() => {
        if (selectedCategory) {
          const unsubscribe = onSnapshot(collection(db, `categories/${selectedCategory}/items`), (snapshot) => {
            const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setInventory(items)
          })
          return () => unsubscribe()
        }
      }, [selectedCategory])

      // Add new inventory item
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

      // Update inventory item
      const handleUpdateItem = async (item) => {
        try {
          await updateDoc(doc(db, `categories/${item.category}/items`, item.id), item)
          setIsEditModalOpen(false)
        } catch (error) {
          console.error('Error updating item:', error)
        }
      }

      // Delete inventory item
      const handleDeleteItem = async (itemId) => {
        try {
          await deleteDoc(doc(db, `categories/${selectedCategory}/items`, itemId))
        } catch (error) {
          console.error('Error deleting item:', error)
        }
      }

      return (
        <div className="min-h-screen bg-gray-100 flex">
          <Sidebar />
          <div className="flex-1 p-8">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Inventory Management</h1>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Inventory
              </button>
            </div>

            {/* Category Overview Section */}
            <CategoryOverview
              categories={categories}
              onSelectCategory={setSelectedCategory}
            />

            {/* Inventory Items Section */}
            {selectedCategory && (
              <InventoryTable
                inventory={inventory}
                onEditItem={(item) => {
                  setEditingItem(item)
                  setIsEditModalOpen(true)
                }}
                onDeleteItem={handleDeleteItem}
              />
            )}

            {/* Add Inventory Modal */}
            <AddInventoryModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleAddItem}
              categories={categories}
            />

            {/* Edit Inventory Modal */}
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
