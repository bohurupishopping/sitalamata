import React, { useState, useEffect } from 'react'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import Sidebar from '../components/Sidebar'
import SummaryCards from '../components/reports/SummaryCards'
import SalesReport from '../components/reports/SalesReport'
import InventoryMovement from '../components/reports/InventoryMovement'
import StockAlerts from '../components/reports/StockAlerts'
import BestSellers from '../components/reports/BestSellers'

export default function Reports() {
  const [dateRange, setDateRange] = useState('week')
  const [salesData, setSalesData] = useState([])
  const [inventoryData, setInventoryData] = useState([])
  const [stockData, setStockData] = useState([])
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
  }, [dateRange])

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
    }
    fetchInventoryData()
  }, [])

  // Calculate stock data
  useEffect(() => {
    const calculateStockData = () => {
      const stockMap = new Map()

      inventoryData.forEach(item => {
        const key = `${item.categoryId}|${item.name}`
        if (stockMap.has(key)) {
          stockMap.set(key, stockMap.get(key) + item.quantity)
        } else {
          stockMap.set(key, item.quantity)
        }
      })

      salesData.forEach(sale => {
        const key = `${sale.category}|${sale.itemName}`
        if (stockMap.has(key)) {
          stockMap.set(key, stockMap.get(key) - sale.quantitySold)
        }
      })

      const stockArray = Array.from(stockMap).map(([key, quantity]) => {
        const [categoryId, name] = key.split('|')
        return { categoryId, name, quantity }
      })

      setStockData(stockArray)
      setLoading(false)
    }

    calculateStockData()
  }, [inventoryData, salesData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Reports Dashboard</h1>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        <SummaryCards 
          salesData={salesData}
          inventoryData={inventoryData}
          stockData={stockData}
          dateRange={dateRange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <SalesReport salesData={salesData} dateRange={dateRange} />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <BestSellers salesData={salesData} dateRange={dateRange} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <InventoryMovement 
              inventoryData={inventoryData}
              salesData={salesData}
              dateRange={dateRange}
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <StockAlerts stockData={stockData} />
          </div>
        </div>
      </div>
    </div>
  )
}
