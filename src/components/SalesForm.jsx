import React, { useState } from "react";

export default function SalesForm({ items, onSubmit, onClose }) {
  const [newSale, setNewSale] = useState({
    itemId: "",
    quantity: 0,
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!newSale.itemId) errors.itemId = "Item is required";
    if (newSale.quantity <= 0) errors.quantity = "Quantity must be greater than 0";
    if (!newSale.date) errors.date = "Date is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...newSale,
        date: new Date(newSale.date),
      });
      setNewSale({
        itemId: "",
        quantity: 0,
        date: new Date().toISOString().split("T")[0],
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl p-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Sale</span>
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Item</label>
            <select
              value={newSale.itemId}
              onChange={(e) => setNewSale({ ...newSale, itemId: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
              required
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.itemId && <p className="text-red-500 text-sm mt-1">{errors.itemId}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              placeholder="Quantity"
              value={newSale.quantity}
              onChange={(e) => setNewSale({ ...newSale, quantity: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
              required
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={newSale.date}
              onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
              required
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              Add Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
