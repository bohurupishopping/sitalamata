import React, { useState, useEffect } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase'
import Sidebar from '../components/Sidebar'

export default function Stock() {
  const [inventoryItems, setInventoryItems] = useState([])
  const [salesData, setSalesData] = useState([])
  const [closingStock, setClosingStock] = useState([])
  const [categories, setCategories] = useState({})

  // Fetch all categories
  useEffect(() => {
    const q = query(collection(db, 'categories'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const categoriesData = {}
      snapshot.forEach(doc => {
        categoriesData[doc.id] = doc.data().name
      })
      setCategories(categoriesData)
    })
    return () => unsubscribe()
  }, [])

  // Fetch inventory items from all categories
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
                  categoryId: categoryDoc.id,
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

  // Fetch sales data
  useEffect(() => {
    const q = query(collection(db, 'sales'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sales = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setSalesData(sales)
    })
    return () => unsubscribe()
  }, [])

  // Calculate closing stock
  useEffect(() => {
    const calculateClosingStock = () => {
      const stockMap = new Map()

      // Add all inventory purchases
      inventoryItems.forEach(item => {
        const key = `${item.categoryId}|${item.name}`
        if (stockMap.has(key)) {
          stockMap.set(key, stockMap.get(key) + item.quantity)
        } else {
          stockMap.set(key, item.quantity)
        }
      })

      // Subtract all sales
      salesData.forEach(sale => {
        const key = `${sale.category}|${sale.itemName}`
        if (stockMap.has(key)) {
          stockMap.set(key, stockMap.get(key) - sale.quantitySold)
        }
      })

      // Convert to array for display
      const closingStockArray = Array.from(stockMap).map(([key, quantity]) => {
        const [categoryId, name] = key.split('|')
        return {
          category: categories[categoryId] || 'Unknown Category',
          name,
          quantity
        }
      })

      setClosingStock(closingStockArray)
    }

    calculateClosingStock()
  }, [inventoryItems, salesData, categories])

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Stock Overview</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Closing Stock</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Item Name</th>
                <th className="p-2 text-left">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {closingStock.length > 0 ? (
                closingStock.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.category}</td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-2 text-center">No stock data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
