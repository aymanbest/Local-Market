import React, { useMemo, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  Package, BarChart2, StarIcon, ClipboardList, 
  MailOpen, Bell, Trash2, X, AlertCircle, ChevronDown, ChevronUp,
  DollarSign, Calendar, MapPin, Phone, Check, MessageCircle
} from 'lucide-react';

const DeleteConfirmation = ({ onConfirm, onCancel, count, isDark }) => (
  <div className={`
    fixed inset-0 flex items-center justify-center z-50
    bg-black/20 backdrop-blur-sm
  `}>
    <div className={`
      p-4 rounded-xl shadow-lg max-w-md w-full mx-4
      transform transition-all duration-300
      animate-in fade-in slide-in-from-bottom-4
      ${isDark 
        ? 'bg-[#1a1a1a] border border-white/10' 
        : 'bg-white border border-black/10'
      }
    `}>
      <div className="flex items-start gap-3 mb-4">
        <div className={`
          p-2 rounded-lg flex-shrink-0
          ${isDark ? 'bg-red-500/20' : 'bg-red-500/10'}
        `}>
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-text mb-1">Delete Notification{count > 0 ? 's' : ''}</h4>
          <p className="text-xs text-textSecondary">
            {count > 0 
              ? `There are ${count + 1} similar notifications. Do you want to delete all of them or just this one?`
              : 'Are you sure you want to delete this notification?'
            }
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onCancel}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium
            transition-colors duration-300
            ${isDark 
              ? 'hover:bg-white/10 text-white/80' 
              : 'hover:bg-black/5 text-black/70'
            }
          `}
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm('single')}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium
            transition-colors duration-300
            ${isDark 
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
              : 'bg-red-500/10 hover:bg-red-500/20 text-red-600'
            }
          `}
        >
          Delete This
        </button>
        {count > 0 && (
          <button
            onClick={() => onConfirm('all')}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium
              bg-red-500 hover:bg-red-600 text-white
              transition-colors duration-300
            `}
          >
            Delete All
          </button>
        )}
      </div>
    </div>
  </div>
);

const formatValue = (value) => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'object') {
    // Handle specific object types
    if ('username' in value) return value.username; // User object
    if ('name' in value) return value.name; // Product/Category object
    if ('productId' in value) return value.name || 'Product'; // Product object
    if ('orderItemId' in value) return `${value.quantity}x ${value.product?.name || 'Product'}`; // OrderItem object
    return JSON.stringify(value);
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return value.toString();
};

const NotificationDetails = ({ data, isDark }) => {
  if (!data) return null;

  const renderDetailItem = (icon, label, value) => (
    <div className="flex items-center gap-2 text-xs">
      {icon}
      <span className="text-textSecondary">{label}:</span>
      <span className="font-medium text-text">{formatValue(value)}</span>
    </div>
  );

  switch (data.type) {
    case 'TICKET_REPLY':
      return (
        <div className="pl-9 mt-2 space-y-2">
          {renderDetailItem(
            <MessageCircle className="w-4 h-4 text-blue-500" />,
            "Subject",
            data.subject
          )}
          {renderDetailItem(
            <MessageCircle className="w-4 h-4 text-green-500" />,
            "Message",
            data.message
          )}
          {renderDetailItem(
            <MessageCircle className="w-4 h-4 text-purple-500" />,
            "Admin",
            data.adminName
          )}
        </div>
      );
    case 'NEW_ORDER':
      return (
        <div className="pl-9 mt-2 space-y-2">
          {renderDetailItem(
            <DollarSign className="w-4 h-4 text-green-500" />,
            "Total",
            `$${data.totalPrice}`
          )}
          {renderDetailItem(
            <MapPin className="w-4 h-4 text-blue-500" />,
            "Address",
            data.shippingAddress
          )}
          {renderDetailItem(
            <Phone className="w-4 h-4 text-purple-500" />,
            "Phone",
            data.phoneNumber
          )}
          {renderDetailItem(
            <Calendar className="w-4 h-4 text-orange-500" />,
            "Date",
            new Date(data.orderDate).toLocaleString()
          )}
        </div>
      );
    case 'STOCK_UPDATED':
      return (
        <div className="pl-9 mt-2 space-y-2">
          {renderDetailItem(
            <Package className="w-4 h-4 text-blue-500" />,
            "Product ID",
            data.productId
          )}
          {renderDetailItem(
            <BarChart2 className="w-4 h-4 text-green-500" />,
            "Previous Quantity",
            data.previousQuantity
          )}
          {renderDetailItem(
            <BarChart2 className="w-4 h-4 text-red-500" />,
            "Change",
            data.reduction ? `-${data.reduction}` : `+${data.addition}`
          )}
        </div>
      );
    default:
      return null;
  }
};

const NotificationItem = ({ 
  notification, 
  onRead, 
  onDelete,
  showDelete = true,
  duplicateCount = 0,
  onDeleteAll = null
}) => {
  const { isDark } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleDelete = (type) => {
    if (type === 'all' && onDeleteAll) {
      onDeleteAll(notification);
    } else {
      onDelete(notification.id);
    }
    setShowDeleteConfirm(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'TICKET_REPLY':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'NEW_ORDER':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'LOW_STOCK_ALERT':
      case 'CRITICAL_STOCK_ALERT':
      case 'STOCK_UPDATED':
        return <BarChart2 className="w-5 h-5 text-red-500" />;
      case 'PRODUCT_APPROVED':
        return <StarIcon className="w-5 h-5 text-green-500" />;
      case 'ORDER_STATUS_UPDATE':
        return <ClipboardList className="w-5 h-5 text-purple-500" />;
      case 'DELIVERY_UPDATE':
        return <Package className="w-5 h-5 text-indigo-500" />;
      case 'REVIEW_STATUS_UPDATE':
        return <MailOpen className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formattedTimestamp = useMemo(() => {
    const date = new Date(notification.timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  }, [notification.timestamp]);

  return (
    <div 
      className={`
        relative
        ${notification.read 
          ? isDark 
            ? 'bg-transparent' 
            : 'bg-transparent' 
          : isDark
            ? 'bg-white/5'
            : 'bg-black/5'
        }
        transition-all duration-300 hover:bg-primary/5
        group
      `}
    >
      <div className="p-3 flex items-start gap-3">
        <div className={`
          p-2 rounded-xl flex-shrink-0
          ${isDark ? 'bg-white/10' : 'bg-black/5'}
        `}>
          {getIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`
              text-sm font-medium
              ${notification.read 
                ? 'text-textSecondary' 
                : 'text-text'
              }
            `}>
              {notification.message}
              {duplicateCount > 0 && (
                <span className={`
                  ml-2 px-2 py-0.5 text-xs rounded-full
                  ${isDark ? 'bg-white/10' : 'bg-black/5'}
                `}>
                  x{duplicateCount + 1}
                </span>
              )}
            </p>
            <div className="flex items-center gap-2">
              {/* Mark as Read Button - Only show if unread */}
              {!notification.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRead(notification.id);
                  }}
                  title="Mark as read"
                  className={`
                    p-1.5 rounded-lg
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300
                    ${isDark 
                      ? 'hover:bg-white/10 text-white/60 hover:text-white' 
                      : 'hover:bg-black/10 text-black/60 hover:text-black'
                    }
                  `}
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              
              {/* Delete Button */}
              {showDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                  }}
                  className={`
                    p-1.5 rounded-lg
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300
                    ${isDark 
                      ? 'hover:bg-white/10 text-white/60 hover:text-white' 
                      : 'hover:bg-black/10 text-black/60 hover:text-black'
                    }
                    ${showDeleteConfirm ? 'opacity-100' : ''}
                  `}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="text-xs text-textSecondary whitespace-nowrap">
                {formattedTimestamp}
              </span>
              {notification.data && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                    console.log('Expanding notification:', { expanded: !expanded, data: notification.data });
                  }}
                  className={`
                    p-1 rounded-lg transition-colors duration-300
                    ${isDark 
                      ? 'hover:bg-white/10' 
                      : 'hover:bg-black/5'
                    }
                  `}
                >
                  {expanded 
                    ? <ChevronUp className="w-4 h-4 text-textSecondary" />
                    : <ChevronDown className="w-4 h-4 text-textSecondary" />
                  }
                </button>
              )}
            </div>
          </div>

          {expanded && notification.data && (
            <div className="mt-2">
              <NotificationDetails 
                data={{ ...notification.data, type: notification.type }}
                isDark={isDark}
              />
            </div>
          )}
        </div>

        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
        )}
      </div>

      {/* Subtle divider */}
      <div className={`
        h-[1px] mx-4
        ${isDark 
          ? 'bg-gradient-to-r from-white/0 via-white/5 to-white/0' 
          : 'bg-gradient-to-r from-black/0 via-black/5 to-black/0'
        }
      `} />

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <DeleteConfirmation
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          count={duplicateCount}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default NotificationItem; 