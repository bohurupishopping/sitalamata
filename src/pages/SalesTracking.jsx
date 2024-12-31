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
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

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

  // Pagination and filtering
  const filteredSales = sales.filter(sale => 
    sale.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage)

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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6">
        <SalesHeader 
          onAddClick={() => setIsAddModalOpen(true)}
          dateRange={dateRange}
          setDateRange={setDateRange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <SalesStats sales={sales} dateRange={dateRange} />

        {/* Sales Table moved here */}
        <div className="mt-4 bg-white rounded-lg shadow-sm">
          <SalesTable 
            sales={currentSales} 
            onEdit={(sale) => {
              setEditingSale(sale)
              setIsEditModalOpen(true)
            }}
            onDelete={handleDeleteSale}
          />
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSales.length)} of {filteredSales.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm bg-gray-100 rounded-md">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <SalesChart sales={sales} dateRange={dateRange} />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Top Selling Items</h2>
            <div className="space-y-2">
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
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm font-medium">{item.quantity} sold</span>
                  </div>
                ))}
            </div>
          </div>
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
