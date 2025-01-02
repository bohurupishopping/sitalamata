import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function PurchaseForm({ onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [newPurchase, setNewPurchase] = useState({
    categoryId: "",
    itemId: "",
    purchaseQty: 0,
    purchaseDate: new Date().toISOString().split("T")[0],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categories"));
    setCategories(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchItems = async (categoryId) => {
    const querySnapshot = await getDocs(collection(db, "items"));
    const filteredItems = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) => item.categoryId === categoryId);
    setItems(filteredItems);
  };

  const handleAddPurchase = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "purchases"), {
      categoryId: newPurchase.categoryId,
      itemId: newPurchase.itemId,
      purchaseQty: newPurchase.purchaseQty,
      purchaseDate: new Date(newPurchase.purchaseDate),
      createdAt: new Date(),
    });
    setNewPurchase({
      categoryId: "",
      itemId: "",
      purchaseQty: 0,
      purchaseDate: new Date().toISOString().split("T")[0],
    });
    onSuccess();
    setIsModalOpen(false);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) {
      alert("Please enter a category name");
      return;
    }
    try {
      const categoryRef = await addDoc(collection(db, "categories"), {
        name: newCategoryName,
        createdAt: new Date(),
      });
      setNewPurchase({ ...newPurchase, categoryId: categoryRef.id });
      setNewCategoryName("");
      setIsCategoryModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName) {
      alert("Please enter an item name");
      return;
    }
    if (!newPurchase.categoryId) {
      alert("Please select a category first");
      return;
    }
    try {
      const itemRef = await addDoc(collection(db, "items"), {
        categoryId: newPurchase.categoryId,
        name: newItemName,
        createdAt: new Date(),
      });
      setNewPurchase({ ...newPurchase, itemId: itemRef.id });
      setNewItemName("");
      setIsItemModalOpen(false);
      fetchItems(newPurchase.categoryId);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add New Purchase</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl p-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>New Purchase</span>
              </h2>
            </div>
            <form onSubmit={handleAddPurchase} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <div className="flex items-center gap-2">
                  <select
                    value={newPurchase.categoryId}
                    onChange={(e) => {
                      setNewPurchase({ ...newPurchase, categoryId: e.target.value });
                      fetchItems(e.target.value);
                    }}
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
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Item</label>
                <div className="flex items-center gap-2">
                  <select
                    value={newPurchase.itemId}
                    onChange={(e) => setNewPurchase({ ...newPurchase, itemId: e.target.value })}
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
                  <button
                    type="button"
                    onClick={() => setIsItemModalOpen(true)}
                    className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newPurchase.purchaseQty}
                  onChange={(e) =>
                    setNewPurchase({ ...newPurchase, purchaseQty: parseInt(e.target.value) })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
                <input
                  type="date"
                  value={newPurchase.purchaseDate}
                  onChange={(e) =>
                    setNewPurchase({ ...newPurchase, purchaseDate: e.target.value })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  Add Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl p-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>New Category</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl p-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>New Item</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-200 hover:bg-gray-100"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
