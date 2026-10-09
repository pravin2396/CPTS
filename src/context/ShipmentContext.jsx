import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_DETAILED_SHIPMENTS,
  PARCEL_TYPES,
  DELIVERY_STATUSES,
  buildInitialHistory
} from '../data/shipmentData';
import {
  apiFetchShipments,
  apiGetShipmentById,
  apiCreateShipment,
  apiUpdateShipment,
  apiDeleteShipment,
  fetchThirdPartyCustomers,
  fetchThirdPartyParcelManifests
} from '../services/shipmentApiService';
import { useNotifications } from './NotificationContext';
import { toast } from 'react-toastify';

const ShipmentContext = createContext();
const SHIPMENTS_STORAGE_KEY = 'cpts_shipments';

export const ShipmentProvider = ({ children }) => {
  const {
    notifyShipmentCreated,
    notifyStatusUpdated,
    notifyDeliveryCompleted,
    notifyFailedDelivery
  } = useNotifications();

  const [shipments, setShipments] = useState(() => {
    try {
      const stored = localStorage.getItem(SHIPMENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Hydrate each shipment ensuring statusHistory is populated and statuses are normalized
          const hydrated = parsed.map((s) => {
            const normalizedStatus = s.deliveryStatus === 'Booked' ? 'Pending' : (s.deliveryStatus || 'Pending');
            const history = (Array.isArray(s.statusHistory) && s.statusHistory.length > 0)
              ? s.statusHistory
              : buildInitialHistory(normalizedStatus, {
                  origin: s.pickupAddress?.split(',')[1]?.trim() || 'Logistics Origin',
                  destination: s.deliveryAddress?.split(',')[1]?.trim() || 'Delivery Destination',
                  date: s.shippingDate || '2026-10-06',
                  updatedBy: s.senderName || 'Dispatch Operations'
                });
            return {
              ...s,
              deliveryStatus: normalizedStatus,
              statusHistory: history
            };
          });

          // If stored records lack Cancelled or Failed Delivery examples, merge seed entries to ensure full 7-status testing
          const hasFailed = hydrated.some((s) => s.deliveryStatus === 'Failed Delivery');
          const hasCancelled = hydrated.some((s) => s.deliveryStatus === 'Cancelled');
          if (!hasFailed || !hasCancelled) {
            const seedMissing = INITIAL_DETAILED_SHIPMENTS.filter(
              (seed) => !hydrated.some((h) => h.trackingNumber === seed.trackingNumber)
            );
            return [...hydrated, ...seedMissing];
          }

          return hydrated;
        }
      }
      localStorage.setItem(SHIPMENTS_STORAGE_KEY, JSON.stringify(INITIAL_DETAILED_SHIPMENTS));
      return INITIAL_DETAILED_SHIPMENTS;
    } catch (e) {
      console.warn('Failed to parse stored shipments, falling back to initial data:', e);
      return INITIAL_DETAILED_SHIPMENTS;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isApiSyncing, setIsApiSyncing] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SHIPMENTS_STORAGE_KEY, JSON.stringify(shipments));
    } catch (e) {
      console.error('Error saving shipments to localStorage:', e);
    }
  }, [shipments]);

  // Replicate READ [GET] operation in browser DevTools Network tab on initial mount
  useEffect(() => {
    const replicateReadOnMount = async () => {
      try {
        await apiFetchShipments(8);
      } catch (err) {
        console.warn('Initial GET request notice:', err);
      }
    };
    replicateReadOnMount();
  }, []);

  // Utility to generate unique tracking numbers
  const generateTrackingNumber = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `TRK-${randomNum}`;
  };

  // Get shipment by ID or tracking number (and replicate GET /posts/:id in Network tab)
  const getShipmentById = (id) => {
    if (!id) return null;
    return shipments.find(
      (s) => s.id === id || s.trackingNumber.toLowerCase() === id.toLowerCase()
    );
  };

  // [READ / GET] Explicitly trigger GET in Network tab on demand
  const refreshRemoteShipments = async () => {
    setIsLoading(true);
    try {
      await apiFetchShipments(8);
      toast.success('Manifest synced with remote API successfully.');
    } catch (error) {
      console.warn('Network sync notice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // [CREATE / POST] Create a new shipment with real HTTP POST request
  // Replicates in browser DevTools Network tab as: POST https://jsonplaceholder.typicode.com/posts (201 Created)
  const createShipment = async (shipmentData) => {
    setIsApiSyncing(true);
    try {
      const trackingNumber = shipmentData.trackingNumber || generateTrackingNumber();
      const initialStatus = shipmentData.deliveryStatus || 'Pending';
      const timestamp = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) + ' ' + new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const initialHistory = [
        {
          id: `hist-create-${Date.now()}`,
          status: initialStatus,
          timestamp,
          location: shipmentData.pickupAddress?.split(',')[1]?.trim() || 'Logistics Depot',
          remarks: 'Consignment created & manifest registered in CPTS.',
          updatedBy: shipmentData.senderName || 'Dispatch Controller'
        }
      ];

      const newShipment = {
        ...shipmentData,
        id: trackingNumber,
        trackingNumber,
        shippingDate: shipmentData.shippingDate || new Date().toISOString().split('T')[0],
        expectedDeliveryDate:
          shipmentData.expectedDeliveryDate ||
          new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        parcelWeight: parseFloat(shipmentData.parcelWeight) || 1.0,
        deliveryStatus: initialStatus,
        parcelType: shipmentData.parcelType || PARCEL_TYPES[0],
        statusHistory: initialHistory
      };

      // HTTP POST request to third-party endpoint
      const apiResult = await apiCreateShipment(newShipment);
      newShipment.apiSynced = apiResult.success;
      newShipment.apiId = apiResult.apiId;

      setShipments((prev) => [newShipment, ...prev]);
      if (notifyShipmentCreated) {
        notifyShipmentCreated(newShipment);
      }
      toast.success(`Shipment ${trackingNumber} created successfully!`);
      return { success: true, shipment: newShipment };
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error('Failed to create shipment. Please check your data.');
      return { success: false, error };
    } finally {
      setIsApiSyncing(false);
    }
  };

  // [UPDATE / PUT] Edit existing shipment with real HTTP PUT request
  // Replicates in browser DevTools Network tab as: PUT https://jsonplaceholder.typicode.com/posts/:id (200 OK)
  const updateShipment = async (id, updatedFields) => {
    setIsApiSyncing(true);
    try {
      const existing = shipments.find((s) => s.id === id);
      if (!existing) {
        toast.error('Shipment not found.');
        return { success: false };
      }

      let statusHistory = existing.statusHistory || [];
      if (updatedFields.deliveryStatus && updatedFields.deliveryStatus !== existing.deliveryStatus) {
        const timestamp = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) + ' ' + new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });

        const historyEntry = {
          id: `hist-upd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          status: updatedFields.deliveryStatus,
          timestamp,
          location: updatedFields.location?.trim() || `${existing.pickupAddress?.split(',')[1]?.trim() || 'Distribution'} Hub`,
          remarks: updatedFields.remarks?.trim() || `Delivery status changed to ${updatedFields.deliveryStatus}.`,
          updatedBy: updatedFields.updatedBy || 'Operations Lead'
        };
        statusHistory = [historyEntry, ...statusHistory];
      }

      const updatedShipment = {
        ...existing,
        ...updatedFields,
        statusHistory,
        parcelWeight: parseFloat(updatedFields.parcelWeight || existing.parcelWeight) || 1.0
      };

      // HTTP PUT request to third-party endpoint
      await apiUpdateShipment(id, updatedShipment);

      setShipments((prev) => prev.map((s) => (s.id === id ? updatedShipment : s)));
      if (updatedFields.deliveryStatus && updatedFields.deliveryStatus !== existing.deliveryStatus) {
        if (updatedFields.deliveryStatus === 'Delivered' && notifyDeliveryCompleted) {
          notifyDeliveryCompleted(updatedShipment, updatedFields.location, updatedFields.remarks);
        } else if (updatedFields.deliveryStatus === 'Failed Delivery' && notifyFailedDelivery) {
          notifyFailedDelivery(updatedShipment, updatedFields.remarks, updatedFields.location);
        } else if (notifyStatusUpdated) {
          notifyStatusUpdated(updatedShipment, updatedFields.deliveryStatus, updatedFields.location, updatedFields.remarks);
        }
      }
      toast.success(`Shipment ${updatedShipment.trackingNumber} updated successfully!`);
      return { success: true, shipment: updatedShipment };
    } catch (error) {
      console.error('Error updating shipment:', error);
      toast.error('Failed to update shipment.');
      return { success: false, error };
    } finally {
      setIsApiSyncing(false);
    }
  };

  // Dedicated Delivery Status Update method (Module 6)
  const updateDeliveryStatus = async (id, newStatus, details = {}) => {
    setIsApiSyncing(true);
    try {
      const existing = shipments.find((s) => s.id === id);
      if (!existing) {
        toast.error('Shipment not found.');
        return { success: false };
      }

      const timestamp = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) + ' ' + new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const newHistoryItem = {
        id: `hist-status-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: newStatus,
        timestamp,
        location: details.location?.trim() || `${existing.deliveryAddress?.split(',')[1]?.trim() || 'Central'} Gateway Hub`,
        remarks: details.remarks?.trim() || `Delivery status transition to ${newStatus}.`,
        updatedBy: details.updatedBy?.trim() || 'Operations Dispatch'
      };

      const updatedShipment = {
        ...existing,
        deliveryStatus: newStatus,
        statusHistory: [newHistoryItem, ...(existing.statusHistory || [])]
      };

      // HTTP PUT request replication
      await apiUpdateShipment(id, updatedShipment);

      setShipments((prev) => prev.map((s) => (s.id === id ? updatedShipment : s)));

      // Trigger respective Module 7 notifications
      if (newStatus === 'Delivered' && notifyDeliveryCompleted) {
        notifyDeliveryCompleted(updatedShipment, details.location, details.remarks);
      } else if (newStatus === 'Failed Delivery' && notifyFailedDelivery) {
        notifyFailedDelivery(updatedShipment, details.remarks, details.location);
      } else if (notifyStatusUpdated) {
        notifyStatusUpdated(updatedShipment, newStatus, details.location, details.remarks);
      }

      toast.success(`Delivery status updated to "${newStatus}" for ${existing.trackingNumber}`);
      return { success: true, shipment: updatedShipment };
    } catch (error) {
      console.error('Error updating delivery status:', error);
      toast.error('Failed to update delivery status.');
      return { success: false, error };
    } finally {
      setIsApiSyncing(false);
    }
  };

  // [DELETE / DELETE] Delete shipment with real HTTP DELETE request
  // Replicates in browser DevTools Network tab as: DELETE https://jsonplaceholder.typicode.com/posts/:id (200 OK)
  const deleteShipment = async (id) => {
    setIsApiSyncing(true);
    try {
      const toDelete = shipments.find((s) => s.id === id);

      // HTTP DELETE request to third-party endpoint
      await apiDeleteShipment(id);

      setShipments((prev) => prev.filter((s) => s.id !== id));
      toast.info(`Shipment ${toDelete?.trackingNumber || id} deleted successfully.`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting shipment:', error);
      toast.error('Failed to delete shipment.');
      return { success: false, error };
    } finally {
      setIsApiSyncing(false);
    }
  };

  // Fetch third-party sample data to auto-fill form (DummyJSON & JSONPlaceholder)
  // Replicates GET /users and GET /products in Network tab
  const fetchSampleFromThirdPartyApi = async () => {
    setIsLoading(true);
    try {
      const [customers, cargoManifests] = await Promise.all([
        fetchThirdPartyCustomers(),
        fetchThirdPartyParcelManifests()
      ]);

      if (!customers || customers.length < 2) {
        throw new Error('Insufficient customer sample records');
      }

      // Pick sender and receiver from JSONPlaceholder users
      const senderIndex = Math.floor(Math.random() * customers.length);
      let receiverIndex = Math.floor(Math.random() * customers.length);
      if (receiverIndex === senderIndex) {
        receiverIndex = (senderIndex + 1) % customers.length;
      }

      const sender = customers[senderIndex];
      const receiver = customers[receiverIndex];

      // Pick product cargo manifest from DummyJSON
      const cargo =
        cargoManifests && cargoManifests.length > 0
          ? cargoManifests[Math.floor(Math.random() * cargoManifests.length)]
          : null;

      // Map dummy category to CPTS parcel type
      let mappedType = PARCEL_TYPES[0];
      if (cargo?.category) {
        const cat = cargo.category.toLowerCase();
        if (cat.includes('beauty') || cat.includes('fragrance')) {
          mappedType = 'Healthcare & Medical';
        } else if (cat.includes('groceries')) {
          mappedType = 'Perishable Freight';
        } else if (cat.includes('furniture') || cat.includes('apparel') || cat.includes('clothing')) {
          mappedType = 'Apparel & Fashion';
        } else {
          mappedType = 'Electronics & Gadgets';
        }
      }

      const today = new Date();
      const shippingDateStr = today.toISOString().split('T')[0];
      const deliveryDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
      const deliveryDateStr = deliveryDate.toISOString().split('T')[0];

      const sampleData = {
        trackingNumber: generateTrackingNumber(),
        senderName: sender.name || 'Acme Logistics Hub',
        receiverName: receiver.name || 'Global Retail Client',
        pickupAddress: `${sender.address?.street || '101 Industrial Pkwy'}, ${sender.address?.city || 'Chicago'}, ${sender.address?.zipcode || '60601'}`,
        deliveryAddress: `${receiver.address?.street || '500 Commerce Blvd'}, ${receiver.address?.city || 'Seattle'}, ${receiver.address?.zipcode || '98101'}`,
        parcelWeight: cargo?.weight ? Number(cargo.weight) : Number((Math.random() * 5 + 0.5).toFixed(1)),
        parcelType: mappedType,
        shippingDate: shippingDateStr,
        expectedDeliveryDate: deliveryDateStr,
        deliveryStatus: 'Booked',
        notes: cargo?.title ? `Consignment cargo: ${cargo.title} via JSONPlaceholder & DummyJSON` : 'Standard freight dispatch.'
      };

      toast.info('Fetched realistic sample from 3rd-Party API successfully.');
      return sampleData;
    } catch (error) {
      console.warn('API sample generation fallback:', error);
      toast.warning('Using offline mock sample generator.');
      return {
        trackingNumber: generateTrackingNumber(),
        senderName: 'Apex Electronics Corp',
        receiverName: 'Nexus Cloud Technologies',
        pickupAddress: '1200 Innovation Way, Austin, TX 78701',
        deliveryAddress: '400 Silicon Valley Blvd, San Jose, CA 95110',
        parcelWeight: 2.8,
        parcelType: PARCEL_TYPES[0],
        shippingDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        deliveryStatus: 'Booked',
        notes: 'Priority fragile shipment.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset shipments back to seed data
  const resetShipmentsToDefault = () => {
    setShipments(INITIAL_DETAILED_SHIPMENTS);
    localStorage.setItem(SHIPMENTS_STORAGE_KEY, JSON.stringify(INITIAL_DETAILED_SHIPMENTS));
    toast.info('Shipments reset to default initial state.');
  };

  return (
    <ShipmentContext.Provider
      value={{
        shipments,
        isLoading,
        isApiSyncing,
        generateTrackingNumber,
        getShipmentById,
        createShipment,
        updateShipment,
        updateDeliveryStatus,
        deleteShipment,
        refreshRemoteShipments,
        fetchSampleFromThirdPartyApi,
        resetShipmentsToDefault,
        PARCEL_TYPES,
        DELIVERY_STATUSES
      }}
    >
      {children}
    </ShipmentContext.Provider>
  );
};

export const useShipments = () => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipments must be used within a ShipmentProvider');
  }
  return context;
};
