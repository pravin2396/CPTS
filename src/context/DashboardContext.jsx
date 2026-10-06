import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DASHBOARD_DATA } from '../data/dashboardData';
import { toast } from 'react-toastify';

const DashboardContext = createContext();
const DASHBOARD_STORAGE_KEY = 'cpts_dashboard_data';

export const DashboardProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(DASHBOARD_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(INITIAL_DASHBOARD_DATA));
      return INITIAL_DASHBOARD_DATA;
    } catch (e) {
      return INITIAL_DASHBOARD_DATA;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving dashboard data to localStorage:', e);
    }
  }, [data]);

  // Derived metrics
  const totalShipments = data.shipments.length;
  const inTransitParcels = data.shipments.filter((s) => s.status === 'In Transit').length;
  const deliveredParcels = data.shipments.filter((s) => s.status === 'Delivered').length;
  const pendingDeliveries = data.shipments.filter((s) => s.status === 'Pending').length;
  const totalCustomers = data.customersCount;

  // Today's Shipments (using date string prefix 2026-10-06)
  const todayDateString = '2026-10-06';
  const todaysShipments = data.shipments.filter((s) => s.date.startsWith(todayDateString)).length;

  // Delivery Success Rate percentage
  const deliverySuccessRate = totalShipments > 0
    ? Math.round((deliveredParcels / totalShipments) * 100)
    : 100;

  // Action: Add quick test shipment
  const addQuickShipment = (newShipment) => {
    const trackingNumber = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullShipment = {
      id: trackingNumber,
      trackingNumber,
      recipient: newShipment.recipient || 'Express Consignee',
      destination: newShipment.destination || 'New York, NY',
      status: newShipment.status || 'In Transit',
      date: new Date().toISOString(),
      type: newShipment.type || 'Express Air',
      weight: newShipment.weight || '1.5 kg'
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      action: 'Quick Parcel Registered',
      description: `${trackingNumber} registered for ${fullShipment.destination}.`,
      time: 'Just now',
      type: 'booking'
    };

    setData((prev) => ({
      ...prev,
      shipments: [fullShipment, ...prev.shipments],
      recentActivities: [newActivity, ...prev.recentActivities.slice(0, 7)]
    }));

    toast.success(`New parcel ${trackingNumber} dispatched!`);
  };

  // Action: Reset dashboard data to initial seed
  const resetDashboardData = () => {
    setData(INITIAL_DASHBOARD_DATA);
    toast.info('Dashboard metrics reset to default values.');
  };

  return (
    <DashboardContext.Provider
      value={{
        shipments: data.shipments,
        recentActivities: data.recentActivities,
        totalShipments,
        inTransitParcels,
        deliveredParcels,
        pendingDeliveries,
        totalCustomers,
        todaysShipments,
        deliverySuccessRate,
        addQuickShipment,
        resetDashboardData
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
