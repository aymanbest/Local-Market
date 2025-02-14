import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const Toast = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 5000,
  position = 'bottom-right'
}) => {
  const { isDark } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getBackgroundColor = () => {
    if (isDark) {
      switch (type) {
        case 'success':
          return 'bg-green-500/20 border-green-500/50';
        case 'error':
          return 'bg-red-500/20 border-red-500/50';
        case 'warning':
          return 'bg-yellow-500/20 border-yellow-500/50';
        default:
          return 'bg-blue-500/20 border-blue-500/50';
      }
    } else {
      switch (type) {
        case 'success':
          return 'bg-green-50 border-green-200';
        case 'error':
          return 'bg-red-50 border-red-200';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200';
        default:
          return 'bg-blue-50 border-blue-200';
      }
    }
  };

  const getTextColor = () => {
    if (isDark) {
      switch (type) {
        case 'success':
          return 'text-green-400';
        case 'error':
          return 'text-red-400';
        case 'warning':
          return 'text-yellow-400';
        default:
          return 'text-blue-400';
      }
    } else {
      switch (type) {
        case 'success':
          return 'text-green-800';
        case 'error':
          return 'text-red-800';
        case 'warning':
          return 'text-yellow-800';
        default:
          return 'text-blue-800';
      }
    }
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div className={`
      fixed ${positionClasses[position]} z-50
      animate-slide-up
    `}>
      <div className={`
        flex items-center gap-3 p-4 rounded-xl
        border ${getBackgroundColor()}
        shadow-lg backdrop-blur-sm
        min-w-[300px] max-w-md
      `}>
        <p className={`flex-1 text-sm font-medium ${getTextColor()}`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className={`
            p-1 rounded-lg hover:bg-black/10
            transition-colors duration-200
            ${getTextColor()}
          `}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast; 