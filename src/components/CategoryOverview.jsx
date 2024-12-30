import React from 'react'

    export default function CategoryOverview({ categories, onSelectCategory }) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectCategory(category.id)}
            >
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="text-gray-600">Total Stock: {category.totalStock || 0}</p>
            </div>
          ))}
        </div>
      )
    }
