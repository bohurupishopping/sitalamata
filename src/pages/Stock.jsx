import React, { useState, useEffect } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase'
import Sidebar from '../components/Sidebar'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function Stock() {
  const [inventoryItems, setInventoryItems] = useState([])
  const [salesData, setSalesData] = useState([])
  const [closingStock, setClosingStock] = useState([])
  const [categories, setCategories] = useState({})
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }))

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

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    // Add title and date
    doc.setFontSize(18)
    doc.text('Stock Overview Report', 15, 15)
    doc.setFontSize(12)
    doc.text(`Date: ${currentDate}`, 15, 22)

    // Prepare table data
    const tableData = closingStock.map(item => [
      item.category,
      item.name,
      item.quantity
    ])

    // Add table
    doc.autoTable({
      startY: 30,
      head: [['Category', 'Item Name', 'Quantity']],
      body: tableData,
      theme: 'striped',
      styles: {
        fontSize: 10,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      }
    })

    // Save the PDF
    doc.save(`Stock_Report_${currentDate.replace(/ /g, '_')}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Stock Overview</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{currentDate}</span>
            <button
              onClick={exportToPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export as PDF
            </button>
          </div>
        </div>
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
