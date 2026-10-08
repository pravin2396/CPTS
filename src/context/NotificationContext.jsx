import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_NOTIFICATIONS } from '../data/notificationData';
import { toast } from 'react-toastify';

const NotificationContext = createContext();
const NOTIFICATIONS_STORAGE_KEY = 'cpts_notifications';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    } catch (e) {
      console.warn('Failed to parse stored notifications, falling back to initial data:', e);
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Error saving notifications to localStorage:', e);
    }
  }, [notifications]);

  // Derived unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Derived recent history (top 6 notifications)
  const recentNotifications = useMemo(() => {
    return notifications.slice(0, 6);
  }, [notifications]);

  // Generic add notification
  const addNotification = ({
    type,
    title,
    message,
    trackingNumber,
    recipient,
    priority = 'normal',
    category,
    silent = false
  }) => {
    const now = new Date();
    const formattedTime = now.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }) + ' • ' + now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      message,
      trackingNumber,
      recipient: recipient || 'Consignee',
      timestamp: now.toISOString(),
      formattedTime,
      isRead: false,
      priority,
      category: category || title
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Optional toast notification for high-priority alerts
    if (!silent) {
      if (type === 'FAILED_DELIVERY') {
        toast.error(`⚠️ ${title}: ${trackingNumber}`);
      } else if (type === 'DELIVERY_COMPLETED') {
        toast.success(`🎉 ${title}: ${trackingNumber}`);
      }
    }

    return newNotification;
  };

  // 1. Feature: Shipment Created Notification
  const notifyShipmentCreated = (shipment) => {
    return addNotification({
      type: 'SHIPMENT_CREATED',
      title: 'Shipment Created Notification',
      message: `Consignment manifest ${shipment.trackingNumber} registered: ${shipment.senderName} (${shipment.pickupAddress?.split(',')[1]?.trim() || 'Origin'}) → ${shipment.receiverName} (${shipment.deliveryAddress?.split(',')[1]?.trim() || 'Destination'}).`,
      trackingNumber: shipment.trackingNumber,
      recipient: shipment.receiverName,
      priority: 'normal',
      category: 'Shipment Created Notification'
    });
  };

  // 2. Feature: Delivery Status Update Notification
  const notifyStatusUpdated = (shipment, newStatus, location, remarks) => {
    const locText = location ? ` at ${location}` : '';
    const remarkText = remarks ? ` (${remarks})` : '';

    return addNotification({
      type: 'STATUS_UPDATED',
      title: `Delivery Status Update: ${newStatus}`,
      message: `Consignment ${shipment.trackingNumber} transitioned to "${newStatus}"${locText}.${remarkText}`,
      trackingNumber: shipment.trackingNumber,
      recipient: shipment.receiverName,
      priority: 'normal',
      category: 'Delivery Status Update Notification'
    });
  };

  // 3. Feature: Delivery Completed Notification
  const notifyDeliveryCompleted = (shipment, location, remarks) => {
    const locText = location ? ` at ${location}` : ` at ${shipment.deliveryAddress}`;
    const remarkText = remarks ? ` Remarks: ${remarks}` : '';

    return addNotification({
      type: 'DELIVERY_COMPLETED',
      title: 'Delivery Completed Notification',
      message: `Consignment ${shipment.trackingNumber} successfully delivered & signed by ${shipment.receiverName}${locText}.${remarkText}`,
      trackingNumber: shipment.trackingNumber,
      recipient: shipment.receiverName,
      priority: 'success',
      category: 'Delivery Completed Notification'
    });
  };

  // 4. Feature: Failed Delivery Alert
  const notifyFailedDelivery = (shipment, reason, location) => {
    const locText = location ? ` at ${location}` : '';
    const reasonText = reason ? ` Reason: ${reason}` : ' Consignee unavailable or premises inaccessible.';

    return addNotification({
      type: 'FAILED_DELIVERY',
      title: 'Failed Delivery Alert',
      message: `Delivery attempt failed for consignment ${shipment.trackingNumber}${locText}.${reasonText} Consignment held at local hub.`,
      trackingNumber: shipment.trackingNumber,
      recipient: shipment.receiverName,
      priority: 'high',
      category: 'Failed Delivery Alert'
    });
  };

  // Feature: Mark Single Notification as Read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Feature: Mark Single Notification as Unread
  const markAsUnread = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
    );
  };

  // Feature: Mark All Notifications as Read
  const markAllAsRead = () => {
    const unreadExist = notifications.some((n) => !n.isRead);
    if (!unreadExist) {
      toast.info('All notifications are already marked as read.');
      return;
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read.');
  };

  // Feature: Delete single notification
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.info('Notification removed.');
  };

  // Feature: Clear read notifications
  const clearReadNotifications = () => {
    setNotifications((prev) => prev.filter((n) => !n.isRead));
    toast.info('Read notifications cleared.');
  };

  // Feature: Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    toast.info('All notifications cleared.');
  };

  // Reset to initial seed
  const resetNotificationsToDefault = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    toast.info('Notifications reset to default seed data.');
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        recentNotifications,
        addNotification,
        notifyShipmentCreated,
        notifyStatusUpdated,
        notifyDeliveryCompleted,
        notifyFailedDelivery,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        clearReadNotifications,
        clearAllNotifications,
        resetNotificationsToDefault
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
