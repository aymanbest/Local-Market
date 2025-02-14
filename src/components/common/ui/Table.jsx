import React from 'react';

export const Table = ({ children, className = '' }) => (
  <div className="w-full">
    <table className={`w-full divide-y divide-border ${className}`}>{children}</table>
  </div>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-background">{children}</thead>
);

export const TableBody = ({ children }) => (
  <tbody className="bg-background divide-y divide-border">{children}</tbody>
);

export const TableRow = ({ children }) => <tr>{children}</tr>;

export const TableHead = ({ children, className = '' }) => (
  <th 
    scope="col" 
    className={`px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider ${className}`}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
);

