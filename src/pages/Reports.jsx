import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
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
    }

    calculateStockData()
  }, [inventoryData, salesData])

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reports Dashboard</h1>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="p-2 border rounded-md"
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

        <div className="grid grid-cols-1 gap-6 mt-6">
          <SalesReport salesData={salesData} dateRange={dateRange} />
          <InventoryMovement 
            inventoryData={inventoryData}
            salesData={salesData}
            dateRange={dateRange}
          />
          <StockAlerts stockData={stockData} />
          <BestSellers salesData={salesData} dateRange={dateRange} />
        </div>
      </div>
    </div>
  )
}
