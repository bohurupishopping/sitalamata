import React, { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase'
import Sidebar from '../components/Sidebar'
import SalesTable from '../components/SalesTable'
import AddSaleModal from '../components/AddSaleModal'

export default function SalesTracking() {
  const [sales, setSales] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [inventoryItems, setInventoryItems] = useState([])

  // Fetch all sales data
  useEffect(() => {
    const q = query(collection(db, 'sales'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const salesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setSales(salesData)
    })
    return () => unsubscribe()
  }, [])

  // Fetch inventory items for sale selection
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const categoriesQuery = query(collection(db, 'categories'))
        const unsubscribeCategories = onSnapshot(categoriesQuery, (categoriesSnapshot) => {
          const allItems = []

          categoriesSnapshot.forEach(async (categoryDoc) => {
            const itemsQuery = query(collection(db, `categories/${categoryDoc.id}/items`))
            const unsubscribeItems = onSnapshot(itemsQuery, (itemsSnapshot) => {
              itemsSnapshot.forEach(itemDoc => {
                allItems.push({
                  id: itemDoc.id,
                  category: categoryDoc.id,
                  ...itemDoc.data()
                })
              })
              setInventoryItems([...allItems])
            })
          })
        })

        return () => unsubscribeCategories()
      } catch (error) {
        console.error('Error fetching inventory:', error)
      }
    }

    fetchInventory()
  }, [])

  // Handle adding a new sale
  const handleAddSale = async (sale) => {
    try {
      await addDoc(collection(db, 'sales'), {
        ...sale,
        saleDate: new Date().toISOString().split('T')[0]
      })
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Error adding sale:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sales Tracking</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add New Sale
          </button>
        </div>

        <SalesTable sales={sales} />

        <AddSaleModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSale}
          inventoryItems={inventoryItems}
        />
      </div>
    </div>
  )
}
