import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }) => {
  const { isDark } = useTheme();
  
  const baseStyles = 'font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300';
  
  const variantStyles = {
    default: isDark 
      ? 'bg-primary text-white hover:bg-primaryHover focus:ring-primary/50'
      : 'bg-primary text-white hover:bg-primaryHover focus:ring-primary/50',
    
    outline: isDark
      ? 'border border-border text-text hover:bg-white/5 focus:ring-primary/50'
      : 'border border-border text-text hover:bg-gray-100 focus:ring-primary/50',
    
    ghost: isDark
      ? 'text-text hover:bg-white/5 focus:ring-gray-500'
      : 'text-text hover:bg-gray-100 focus:ring-gray-500',
    
    destructive: isDark
      ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
      : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      
    success: isDark
      ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
      : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    
    secondary: isDark
      ? 'bg-cardBg border border-border text-text hover:bg-white/5 focus:ring-primary/50'
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-primary/50',
  };

  const sizeStyles = {
    default: 'px-4 py-2',
    sm: 'px-3 py-1.5 text-sm',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2',
  };

  const disabledStyles = props.disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'transform active:scale-95';

  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;

