import { jsPDF } from "jspdf";

const GeneratePDF = (columns, data, title, fileName, styles) => {
  const doc = new jsPDF();

  doc.setFontSize(styles.titleFontSize || 18);
  doc.setTextColor(...styles.titleTextColor);
  doc.text(title, 20, 20);

  let y = 30; 

  
  doc.setFontSize(styles.headerFontSize || 12);
  
  // Set header background color to black
  doc.setFillColor(0, 0, 0); 
  doc.setTextColor(255, 255, 255); 

  columns.forEach((col, index) => {
    doc.rect(20 + index * 60, y, 60, 10, 'FD'); 
    doc.text(col, 20 + index * 60 + 30, y + 6, null, null, 'center');
  });

  // Increase Y for data rows
  y += 10;

  
  const rowHeight = 10; 
  data.forEach((row, rowIndex) => {
    columns.forEach((col, colIndex) => {
      let text = '';
      switch (col) {
        case 'Username':
          text = row.username;
          break;
        case 'Role':
          text = row.role;
          break;
        case 'ID':
          text = row.id.toString();
          break;
        default:
          break;
      }

    
      if (rowIndex % 2 === 0) {
        doc.setFillColor(240, 240, 240);
      } else {
        doc.setFillColor(255, 255, 255); 
      }

      // Draw data cells with padding
      doc.rect(20 + colIndex * 60, y + rowIndex * rowHeight, 60, rowHeight, 'FD');
      
      doc.setTextColor(...styles.rowTextColor); 
      doc.text(text || '', 20 + colIndex * 60 + 30, y + rowIndex * rowHeight + 5, null, null, 'center');
    });
  });

  
  doc.save(fileName);
};

export default GeneratePDF;
