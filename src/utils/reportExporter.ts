
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (reportData: any, reportType: string) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Restaurant Inventory Report', 20, 20);
  
  doc.setFontSize(14);
  doc.text(`Report Type: ${reportType}`, 20, 35);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
  
  // Add table based on report type
  let tableData: any[] = [];
  let headers: string[] = [];
  
  switch (reportType) {
    case 'inventory':
      headers = ['Category', 'Current Stock', 'Target Stock', 'Value ($)'];
      tableData = reportData.map((item: any) => [
        item.name,
        item.current,
        item.target,
        item.value
      ]);
      break;
    case 'purchases':
      headers = ['Supplier', 'Amount ($)', 'Orders'];
      tableData = reportData.map((item: any) => [
        item.supplier,
        item.amount,
        item.orders
      ]);
      break;
    default:
      headers = ['Item', 'Value'];
      tableData = reportData.map((item: any) => [
        Object.keys(item)[0],
        Object.values(item)[0]
      ]);
  }
  
  (doc as any).autoTable({
    head: [headers],
    body: tableData,
    startY: 60,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] },
  });
  
  // Save the PDF
  doc.save(`${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportToExcel = (reportData: any, reportType: string) => {
  const ws = XLSX.utils.json_to_sheet(reportData);
  const wb = XLSX.utils.book_new();
  
  XLSX.utils.book_append_sheet(wb, ws, reportType);
  
  // Add some styling
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ c: C, r: R });
      if (!ws[cell_address]) continue;
      
      if (R === 0) {
        // Header row styling
        ws[cell_address].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "4F46E5" } },
          color: { rgb: "FFFFFF" }
        };
      }
    }
  }
  
  XLSX.writeFile(wb, `${reportType}_report_${new Date().toISOString().split('T')[0]}.xlsx`);
};
