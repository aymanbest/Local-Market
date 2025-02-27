import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

export const Table = ({ children, className = '' }) => {

  
  return (
    <div className={`w-full overflow-hidden bg-white dark:bg-cardBg rounded-xl border border-border ${className}`}>
      <table className="w-full divide-y divide-border">
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-50/50 dark:bg-black/20">
    {children}
  </thead>
);

export const TableBody = ({ children }) => (
  <tbody className="bg-white dark:bg-cardBg divide-y divide-border">
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '' }) => (
  <tr className={`hover:bg-gray-50/80 dark:hover:bg-white/[0.02] transition-colors duration-200 ${className}`}>
    {children}
  </tr>
);

export const TableHead = ({ children, className = '' }) => (
  <th 
    scope="col" 
    className={`px-6 py-4 text-left text-xs font-medium text-textSecondary uppercase tracking-wider ${className}`}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-text ${className}`}>
    {children}
  </td>
);

