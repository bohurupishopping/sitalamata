import React, { useState } from "react";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function EditSaleModal({ sale, items, onClose, onSuccess }) {
  const [editedSale, setEditedSale] = useState({
    itemId: sale.itemId,
    quantity: sale.quantity,
    date: sale.date?.toDate ? sale.date.toDate().toISOString().split("T")[0] : new Date(sale.date).toISOString().split("T")[0],
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "sales", sale.id), {
        ...editedSale,
        date: new Date(editedSale.date),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "sales", sale.id));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl p-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Sale</span>
          </h2>
        </div>
        <form onSubmit={handleUpdate} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Item</label>
            <select
              value={editedSale.itemId}
              onChange={(e) => setEditedSale({ ...editedSale, itemId: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
              required
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={editedSale.quantity}
              onChange={(e) => setEditedSale({ ...editedSale, quantity: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={editedSale.date}
              onChange={(e) => setEditedSale({ ...editedSale, date: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              Delete
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
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
