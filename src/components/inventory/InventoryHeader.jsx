import React from 'react'

export default function InventoryHeader({ categories, selectedCategory, setSelectedCategory, onAddClick }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
      <div className="mb-4 md:mb-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Inventory</h1>
        <p className="text-xs md:text-sm text-gray-500">Track and manage your inventory</p>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-48 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          onClick={onAddClick}
          className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Item
        </button>
      </div>
    </div>
  )
}
