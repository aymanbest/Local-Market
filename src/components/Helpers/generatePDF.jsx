import { jsPDF } from "jspdf";

const GeneratePDF = (columns, data, title, fileName, styles) => {
  const doc = new jsPDF();

  // Title Styling
  doc.setFontSize(styles.titleFontSize || 18);
  doc.setTextColor(...styles.titleTextColor);
  doc.text(title, 20, 20);

  let y = 30; // Initial Y position for content

  // Header Styling
  doc.setFontSize(styles.headerFontSize || 12);
  
  // Set header background color to black
  doc.setFillColor(0, 0, 0); // Black background for header
  doc.setTextColor(255, 255, 255); // White text for header

  columns.forEach((col, index) => {
    doc.rect(20 + index * 60, y, 60, 10, 'FD'); // 'FD' means fill and stroke
    doc.text(col, 20 + index * 60 + 30, y + 6, null, null, 'center');
  });

  // Increase Y for data rows
  y += 10;

  // Data Rows Styling (Explicitly set for each row)
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

      // Apply alternate row colors for better readability
      if (rowIndex % 2 === 0) {
        doc.setFillColor(240, 240, 240); // Light gray for even rows
      } else {
        doc.setFillColor(255, 255, 255); // White for odd rows
      }

      // Draw data cells with padding
      doc.rect(20 + colIndex * 60, y + rowIndex * rowHeight, 60, rowHeight, 'FD');
      // Add text inside the cells, centered
      doc.setTextColor(...styles.rowTextColor); // Ensure row text color is set
      doc.text(text || '', 20 + colIndex * 60 + 30, y + rowIndex * rowHeight + 5, null, null, 'center');
    });
  });

  // Save the document
  doc.save(fileName);
};

export default GeneratePDF;
