import React, { useState, useEffect } from 'react'
import { collection, onSnapshot, query, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import Sidebar from '../components/Sidebar'
import StockHeader from '../components/stock/StockHeader'
import StockStats from '../components/stock/StockStats'
import StockTable from '../components/stock/StockTable'
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
      const categoriesQuery = query(collection(db, 'categories'))
      const categoriesSnapshot = await getDocs(categoriesQuery)
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
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Add title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Stock Overview Report', 15, 20)

    // Add subtitle
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated on: ${currentDate}`, 15, 28)

    // Add summary section
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Summary', 15, 40)
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Total Items: ${closingStock.length}`, 15, 48)
    doc.text(`Total Quantity: ${closingStock.reduce((sum, item) => sum + item.quantity, 0)}`, 15, 56)
    doc.text(`Low Stock Items: ${closingStock.filter(item => item.quantity > 0 && item.quantity < 10).length}`, 15, 64)
    doc.text(`Out of Stock Items: ${closingStock.filter(item => item.quantity <= 0).length}`, 15, 72)

    // Add table
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Stock Details', 15, 84)

    const tableData = closingStock.map(item => [
      item.category,
      item.name,
      item.quantity,
      item.quantity <= 0 ? 'Out of Stock' : 
      item.quantity < 10 ? 'Low Stock' : 'In Stock'
    ])

    doc.autoTable({
      startY: 90,
      head: [['Category', 'Item Name', 'Quantity', 'Status']],
      body: tableData,
      theme: 'striped',
      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 70 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 }
      },
      margin: { left: 15 }
    })

    // Add footer
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(
        `Page ${i} of ${pageCount}`,
        200,
        290,
        null,
        null,
        'right'
      )
    }

    // Save the PDF
    doc.save(`Stock_Report_${currentDate.replace(/ /g, '_')}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <StockHeader 
          currentDate={currentDate}
          onExport={exportToPDF}
        />

        <StockStats closingStock={closingStock} />

        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <StockTable closingStock={closingStock} />
        </div>
      </div>
    </div>
  )
}
