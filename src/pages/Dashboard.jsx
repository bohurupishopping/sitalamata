import React, { useState, useEffect } from 'react'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import Sidebar from '../components/Sidebar'
import DashboardSummary from '../components/dashboard/DashboardSummary'
import SalesTrendChart from '../components/dashboard/SalesTrendChart'
import InventoryOverview from '../components/dashboard/InventoryOverview'

export default function Dashboard() {
  const [salesData, setSalesData] = useState([])
  const [inventoryData, setInventoryData] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch sales data
  useEffect(() => {
    const fetchSalesData = async () => {
      const q = query(collection(db, 'sales'))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setSalesData(data)
    }
    fetchSalesData()
  }, [])

  // Fetch inventory data
  useEffect(() => {
    const fetchInventoryData = async () => {
      const categoriesQuery = query(collection(db, 'categories'))
      const categoriesSnapshot = await getDocs(categoriesQuery)
      const allItems = []

      for (const categoryDoc of categoriesSnapshot.docs) {
        const itemsQuery = query(collection(db, `categories/${categoryDoc.id}/items`))
        const itemsSnapshot = await getDocs(itemsQuery)
        itemsSnapshot.forEach(itemDoc => {
          allItems.push({
            id: itemDoc.id,
            categoryId: categoryDoc.id,
            ...itemDoc.data()
          })
        })
      }
      setInventoryData(allItems)
      setLoading(false)
    }
    fetchInventoryData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-xl font-bold mb-4">Dashboard Overview</h1>
        
        <DashboardSummary 
          salesData={salesData}
          inventoryData={inventoryData}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="h-72">
            <SalesTrendChart salesData={salesData} />
          </div>
          <div className="h-72">
            <InventoryOverview inventoryData={inventoryData} />
          </div>
        </div>
      </div>
    </div>
  )
}
