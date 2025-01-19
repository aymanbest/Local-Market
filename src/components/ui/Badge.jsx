import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variantStyles = {
    default: 'bg-gray-900 text-gray-200',
    success: 'bg-green-900 text-green-200',
    warning: 'bg-yellow-900 text-yellow-200',
    destructive: 'bg-red-900 text-red-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;

