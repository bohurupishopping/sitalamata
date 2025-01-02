import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generateStockPDF = (items, sales, purchases) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Title Section
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 128, 185);
  doc.text("Stock Overview Report", 15, 20);

  // Date Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  const date = new Date().toLocaleDateString();
  doc.text(`Generated on: ${date}`, 15, 28);

  // Table Data
  const tableData = items.map((item) => {
    const totalPurchaseQty = purchases
      .filter((purchase) => purchase.itemId === item.id)
      .reduce((sum, purchase) => sum + purchase.purchaseQty, 0);
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

  // Table Headers
  const headers = [
    [
      { content: "Item", styles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: "bold" } },
      { content: "Purchase Quantity", styles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: "bold" } },
      { content: "Total Sales", styles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: "bold" } },
      { content: "Closing Stock", styles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: "bold" } },
    ],
  ];

  // AutoTable Configuration
  doc.autoTable({
    startY: 35,
    head: headers,
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
    didDrawPage: (data) => {
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${data.pageNumber}`,
        doc.internal.pageSize.width - 15,
        doc.internal.pageSize.height - 10,
        { align: "right" }
      );
    },
  });

  // Save PDF
  doc.save("stock-overview-report.pdf");
};
