import React, { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, query, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import Sidebar from '../components/Sidebar'
import SalesHeader from '../components/sales/SalesHeader'
import SalesStats from '../components/sales/SalesStats'
import SalesChart from '../components/sales/SalesChart'
import SalesTable from '../components/sales/SalesTable'
import AddSaleModal from '../components/sales/AddSaleModal'
import EditSaleModal from '../components/sales/EditSaleModal'

export default function SalesTracking() {
  const [sales, setSales] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingSale, setEditingSale] = useState(null)
  const [inventoryItems, setInventoryItems] = useState([])
  const [dateRange, setDateRange] = useState('week')

  // Fetch sales data
  useEffect(() => {
    const q = query(collection(db, 'sales'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const salesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setSales(salesData)
    })
    return () => unsubscribe()
  }, [])

  // Fetch inventory items
  useEffect(() => {
    const fetchInventory = async () => {
      const categoriesQuery = query(collection(db, 'categories'))
      const categoriesSnapshot = await getDocs(categoriesQuery)
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
    }

    fetchInventory()
  }, [])

  const handleAddSale = async (sale) => {
    try {
      await addDoc(collection(db, 'sales'), sale)
    } catch (error) {
      console.error('Error adding sale:', error)
    }
  }

  const handleEditSale = async (sale) => {
    try {
      await updateDoc(doc(db, 'sales', sale.id), sale)
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Error updating sale:', error)
    }
  }

  const handleDeleteSale = async (saleId) => {
    try {
      await deleteDoc(doc(db, 'sales', saleId))
    } catch (error) {
      console.error('Error deleting sale:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <SalesHeader 
          onAddClick={() => setIsAddModalOpen(true)}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <SalesStats sales={sales} dateRange={dateRange} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <SalesChart sales={sales} dateRange={dateRange} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Top Selling Items</h2>
            <div className="space-y-3">
              {sales
                .reduce((acc, sale) => {
                  const existing = acc.find(item => item.name === sale.itemName)
                  if (existing) {
                    existing.quantity += sale.quantitySold
                  } else {
                    acc.push({ name: sale.itemName, quantity: sale.quantitySold })
                  }
                  return acc
                }, [])
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 5)
                .map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm text-gray-600">{item.quantity} sold</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <SalesTable 
            sales={sales} 
            onEdit={(sale) => {
              setEditingSale(sale)
              setIsEditModalOpen(true)
            }}
            onDelete={handleDeleteSale}
          />
        </div>

        <AddSaleModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSale}
          inventoryItems={inventoryItems}
        />

        <EditSaleModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSale}
          sale={editingSale}
          inventoryItems={inventoryItems}
        />
      </div>
    </div>
  )
}
