import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Sidebar from "../components/Sidebar";
import { useData } from "../hooks/useData";
import { usePagination } from "../hooks/usePagination";

export default function StockOverview() {
  const { items, sales, purchases, loading } = useData();
  const { currentItems, currentPage, paginate, totalPages } = usePagination(items);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const calculateTotalPurchaseQty = (itemId) => {
    return purchases
      .filter((purchase) => purchase.itemId === itemId)
      .reduce((sum, purchase) => sum + purchase.purchaseQty, 0);
  };

  const calculateClosingStock = (itemId) => {
    const totalPurchaseQty = calculateTotalPurchaseQty(itemId);
    const totalSales = sales
      .filter((sale) => sale.itemId === itemId)
      .reduce((sum, sale) => sum + sale.quantity, 0);

    return totalPurchaseQty - totalSales;
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Stock Overview Report", 14, 20);
    const tableData = items.map((item) => {
      const totalPurchaseQty = calculateTotalPurchaseQty(item.id);
      const totalSales = sales
        .filter((sale) => sale.itemId === item.id)
        .reduce((sum, sale) => sum + sale.quantity, 0);
      const closingStock = totalPurchaseQty - totalSales;

      return [
        item.name,
        `${totalPurchaseQty} ${item.unit || ""}`,
        `${totalSales} ${item.unit || ""}`,
        `${closingStock} ${item.unit || ""}`,
      ];
    });

    doc.autoTable({
      startY: 30,
      head: [["Item", "Purchase Quantity", "Total Sales", "Closing Stock"]],
      body: tableData,
      theme: "striped",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { halign: "left", cellWidth: 60 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
      },
    });

    doc.save("stock-overview-report.pdf");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className={`transition-all duration-200 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Stock Overview
            </h1>
            <button
              onClick={handleExportPDF}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Items</p>
                  <p className="text-3xl font-bold">{items.length}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Purchases</p>
                  <p className="text-3xl font-bold">{purchases.length}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Sales</p>
                  <p className="text-3xl font-bold">{sales.length}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Stock Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Item</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Purchase Quantity</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Total Sales</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Closing Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentItems.map((item) => {
                      const totalPurchaseQty = calculateTotalPurchaseQty(item.id);
                      const totalSales = sales
                        .filter((sale) => sale.itemId === item.id)
                        .reduce((sum, sale) => sum + sale.quantity, 0);
                      const closingStock = totalPurchaseQty - totalSales;

                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{totalPurchaseQty} {item.unit || ""}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{totalSales} {item.unit || ""}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              closingStock > 10 ? "bg-green-100 text-green-700" :
                              closingStock > 0 ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {closingStock} {item.unit || ""}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow-sm">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 border border-gray-200 text-sm font-medium ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } ${i === 0 ? "rounded-l-md" : ""} ${
                    i === totalPages - 1 ? "rounded-r-md" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
