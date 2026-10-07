import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CUSTOMERS } from '../data/customerData';
import {
  apiFetchCustomers,
  apiGetCustomerById,
  apiCreateCustomer,
  apiUpdateCustomer,
  apiDeleteCustomer
} from '../services/customerApiService';
import { toast } from 'react-toastify';

const CustomerContext = createContext();
const CUSTOMERS_STORAGE_KEY = 'cpts_customers';

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState(() => {
    try {
      const stored = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    } catch (e) {
      console.warn('Failed to parse stored customers, falling back to seed data:', e);
      return INITIAL_CUSTOMERS;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isApiSyncing, setIsApiSyncing] = useState(false);

  // Sync state changes to localStorage (protected by cpts_* prefix in storageCleanup)
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
    } catch (e) {
      console.error('Error saving customers to localStorage:', e);
    }
  }, [customers]);

  // Replicate READ [GET /users] in browser DevTools Network tab on initial load
  useEffect(() => {
    const replicateReadOnMount = async () => {
      try {
        await apiFetchCustomers();
      } catch (err) {
        console.warn('Initial customer network fetch notice:', err);
      }
    };
    replicateReadOnMount();
  }, []);

  // Utility to generate unique Customer IDs
  const generateCustomerId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `CUST-${randomNum}`;
  };

  // Find customer by ID
  const getCustomerById = (id) => {
    if (!id) return null;
    return customers.find(
      (c) => c.id === id || c.id.toLowerCase() === id.toLowerCase()
    );
  };

  // [CREATE / POST] Add Customer with real HTTP POST request
  // Replicates in browser DevTools Network tab as: POST https://jsonplaceholder.typicode.com/users (201 Created)
  const createCustomer = async (customerData) => {
    setIsApiSyncing(true);
    try {
      const id = generateCustomerId();
      const newCustomer = {
        ...customerData,
        id,
        status: customerData.status || 'Active',
        joinedDate: customerData.joinedDate || new Date().toISOString().split('T')[0],
        totalShipments: Number(customerData.totalShipments) || 0,
        notes: customerData.notes || 'Registered client.'
      };

      // HTTP POST request
      const apiResult = await apiCreateCustomer(newCustomer);
      newCustomer.apiSynced = apiResult.success;
      newCustomer.apiId = apiResult.apiId;

      setCustomers((prev) => [newCustomer, ...prev]);
      toast.success(`Customer "${newCustomer.name}" added successfully!`);
      return { success: true, customer: newCustomer };
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Failed to create customer record.');
      return { success: false, error };
    } finally {
      setIsApiSyncing(false);
    }
  };

  // [UPDATE / PUT] Edit Customer with real HTTP PUT request
  // Replicates in browser DevTools Network tab as: PUT https://jsonplaceholder.typicode.com/users/:id (200 OK)
  const updateCustomer = async (id, updatedFields) => {
    setIsApiSyncing(true);
    try {
      const existing = customers.find((c) => c.id === id);
      if (!existing) {
        toast.error('Customer not found.');
        return { success: false };
      }

      const updatedCustomer = {
        ...existing,
        ...updatedFields
      };

      // HTTP PUT request
      await apiUpdateCustomer(id, updatedCustomer);

      setCustomers((prev) => prev.map((c) => (c.id === id ? updatedCustomer : c)));
      toast.success(`Customer "${updatedCustomer.name}" updated successfully!`);
      return { success: true, customer: updatedCustomer };
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer record.');
      return { success: false, error };
    } finally {
      setIsApiSyncing(false);
    }
  };

  // [DELETE / DELETE] Delete Customer with real HTTP DELETE request
  // Replicates in browser DevTools Network tab as: DELETE https://jsonplaceholder.typicode.com/users/:id (200 OK)
  const deleteCustomer = async (id) => {
    setIsApiSyncing(true);
    try {
      const toDelete = customers.find((c) => c.id === id);

      // HTTP DELETE request
      await apiDeleteCustomer(id);

      setCustomers((prev) => prev.filter((s) => s.id !== id));
      toast.info(`Customer "${toDelete?.name || id}" removed successfully.`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer.');
      return { success: false, error };
    } finally {
      setIsApiSyncing(false);
    }
  };

  // [READ / GET] Explicitly sync customers from remote endpoint
  const refreshRemoteCustomers = async () => {
    setIsLoading(true);
    try {
      await apiFetchCustomers();
      toast.success('Customer directory synced successfully.');
    } catch (error) {
      console.warn('Network sync notice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Autofill sample customer from JSONPlaceholder API
  const fetchSampleFromApi = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetchCustomers();
      const list = res.data || [];
      if (list.length > 0) {
        const rand = list[Math.floor(Math.random() * list.length)];
        const sample = {
          name: rand.name || 'Alexis Stone',
          email: rand.email ? rand.email.toLowerCase() : 'alexis.stone@client.org',
          mobile: rand.phone || '+1 (555) 789-0123',
          address: `${rand.address?.suite || 'Suite 200'}, ${rand.address?.street || 'Market Street'}`,
          city: rand.address?.city || 'San Francisco',
          postalCode: rand.address?.zipcode?.split('-')[0] || '94103',
          status: 'Active',
          notes: `Verified client: ${rand.company?.name || 'Logistics Partner'}`
        };
        toast.info('Fetched sample customer profile from API!');
        return sample;
      }
      throw new Error('No user data returned');
    } catch (error) {
      toast.warning('Using offline mock customer sample.');
      return {
        name: 'Jordan Bradley',
        email: 'jordan.bradley@pacificfreight.com',
        mobile: '+1 (555) 489-2210',
        address: '1500 Harbor Blvd, Suite 400',
        city: 'Seattle',
        postalCode: '98104',
        status: 'Active',
        notes: 'Commercial shipping account.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset customers back to initial seed data
  const resetCustomersToDefault = () => {
    setCustomers(INITIAL_CUSTOMERS);
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
    toast.info('Customer directory reset to initial default records.');
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        isLoading,
        isApiSyncing,
        getCustomerById,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        refreshRemoteCustomers,
        fetchSampleFromApi,
        resetCustomersToDefault
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};
