import React from 'react'

    export default function DataTable({ data }) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full">
            <thead>
              <tr>
                {Object.keys(data[0] || {}).map((key) => (
                  <th key={key} className="text-left p-2">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, i) => (
                    <td key={i} className="p-2">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
