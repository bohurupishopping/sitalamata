import React, { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function EditPurchaseModal({ purchase, categories, items, onClose, onSuccess }) {
  const [editedPurchase, setEditedPurchase] = useState({
    categoryId: purchase.categoryId,
    itemId: purchase.itemId,
    purchaseDate: purchase.purchaseDate.toDate().toISOString().split("T")[0],
    purchaseQty: purchase.purchaseQty,
  });

  const handleUpdatePurchase = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "purchases", purchase.id), {
        ...editedPurchase,
        purchaseDate: new Date(editedPurchase.purchaseDate),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating purchase:", error);
    }
  };

  const handleDeletePurchase = async () => {
    try {
      await deleteDoc(doc(db, "purchases", purchase.id));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl p-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Purchase</span>
          </h2>
        </div>
        <form onSubmit={handleUpdatePurchase} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={editedPurchase.categoryId}
              onChange={(e) =>
                setEditedPurchase({ ...editedPurchase, categoryId: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Item</label>
            <select
              value={editedPurchase.itemId}
              onChange={(e) =>
                setEditedPurchase({ ...editedPurchase, itemId: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
              required
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
            <input
              type="date"
              value={editedPurchase.purchaseDate}
              onChange={(e) =>
                setEditedPurchase({ ...editedPurchase, purchaseDate: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={editedPurchase.purchaseQty}
              onChange={(e) =>
                setEditedPurchase({ ...editedPurchase, purchaseQty: parseInt(e.target.value) })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleDeletePurchase}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              Delete
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
