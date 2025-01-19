import { jsPDF } from 'jspdf';

const generatePDF = (columns, data, title, fileName, styles) => {
  const doc = new jsPDF();

  doc.setFontSize(styles.titleFontSize || 18);
  doc.setTextColor(styles.titleTextColor || 0, 0, 0);
  doc.text(title, 20, 20);

 
  let y = 30;
  doc.setFontSize(styles.headerFontSize || 12);
  doc.setTextColor(styles.headerTextColor || 0, 0, 0);

  columns.forEach((col, index) => {
    doc.text(col, 20 + index * 40, y); 
  });

  // Add data rows dynamically
  y += 10;
  data.forEach((row, index) => {
    columns.forEach((col, colIndex) => {
      doc.text(row[col] || '', 20 + colIndex * 40, y + index * 10);
    });
  });

  
  doc.save(fileName);
};

export default generatePDF;