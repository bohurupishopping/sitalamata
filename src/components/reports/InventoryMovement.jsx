import React from 'react'

export default function InventoryMovement({ inventoryData, salesData }) {
  // Calculate net inventory
  const inventoryMap = new Map()

  inventoryData.forEach(item => {
    const key = `${item.categoryId}|${item.name}`
    inventoryMap.set(key, (inventoryMap.get(key) || 0) + item.quantity)
  })

  salesData.forEach(sale => {
    const key = `${sale.category}|${sale.itemName}`
    inventoryMap.set(key, (inventoryMap.get(key) || 0) - sale.quantitySold)
  })

  const inventoryMovement = Array.from(inventoryMap).map(([key, net]) => {
    const [categoryId, name] = key.split('|')
    return { categoryId, name, net }
  })

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Inventory Movement</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Item Name</th>
              <th className="p-2 text-left">Net Inventory</th>
            </tr>
          </thead>
          <tbody>
            {inventoryMovement.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className={`p-2 ${item.net < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {item.net}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
