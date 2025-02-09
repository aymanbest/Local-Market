import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Toast from './Toast';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  const [shownNotificationIds, setShownNotificationIds] = useState(new Set());
  const { notifications } = useSelector(state => state.notifications);

  useEffect(() => {
    // When a new notification arrives, create a toast if not already shown
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      
      // Only show toast for new notifications that haven't been shown yet
      if (!shownNotificationIds.has(latestNotification.id)) {
        const getToastType = (notificationType) => {
          switch (notificationType) {
            case 'NEW_ORDER':
            case 'PRODUCT_APPROVED':
            case 'ORDER_STATUS_UPDATE':
            case 'DELIVERY_UPDATE':
            case 'REVIEW_STATUS_UPDATE':
              return 'success';
            case 'LOW_STOCK_ALERT':
            case 'STOCK_MOVEMENT':
              return 'warning';
            case 'CRITICAL_STOCK_ALERT':
              return 'error';
            default:
              return 'info';
          }
        };

        const newToast = {
          id: latestNotification.id,
          message: latestNotification.message,
          type: getToastType(latestNotification.type)
        };

        setToasts(prev => [newToast, ...prev]);
        setShownNotificationIds(prev => new Set([...prev, latestNotification.id]));
      }
    }
  }, [notifications, shownNotificationIds]);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          position="bottom-right"
          duration={5000}
        />
      ))}
    </>
  );
};

export default ToastContainer; 