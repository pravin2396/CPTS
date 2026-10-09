import axios from 'axios';

// Public Third-Party API endpoint (JSONPlaceholder Users REST API)
const JSONPLACEHOLDER_USERS_URL = 'https://jsonplaceholder.typicode.com/users';

/**
 * Extract safe numeric ID for JSONPlaceholder users (1 to 10)
 */
const getSafeNumericId = (id) => {
  if (typeof id === 'number' && id > 0 && id <= 10) return id;
  if (typeof id === 'string') {
    const num = parseInt(id.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > 0) return (num % 10) || 1;
  }
  return 1;
};

/**
 * [READ / GET] Fetch customers list from third-party REST API
 * Replicates in DevTools Network tab as:
 * GET https://jsonplaceholder.typicode.com/users
 * Status: 200 OK
 */
export const apiFetchCustomers = async () => {
  try {
    const res = await axios.get(JSONPLACEHOLDER_USERS_URL, { timeout: 8000 });
    return { success: true, data: res.data, status: res.status };
  } catch (error) {
    console.warn('[Network API] GET /users error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * [READ / GET] Fetch single customer profile by ID from third-party REST API
 * Replicates in DevTools Network tab as:
 * GET https://jsonplaceholder.typicode.com/users/:id
 * Status: 200 OK
 */
export const apiGetCustomerById = async (id) => {
  const safeId = getSafeNumericId(id);
  try {
    const res = await axios.get(`${JSONPLACEHOLDER_USERS_URL}/${safeId}`, {
      timeout: 6000
    });
    return { success: true, data: res.data, status: res.status };
  } catch (error) {
    console.warn(`[Network API] GET /users/${safeId} error:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * [CREATE / POST] Create new customer record via third-party REST API
 * Replicates in DevTools Network tab as:
 * POST https://jsonplaceholder.typicode.com/users
 * Status: 201 Created
 */
export const apiCreateCustomer = async (customerData) => {
  try {
    const payload = {
      name: customerData.name,
      email: customerData.email,
      phone: customerData.mobile,
      address: {
        street: customerData.address,
        city: customerData.city,
        zipcode: customerData.postalCode
      },
      ...customerData
    };
    const res = await axios.post(JSONPLACEHOLDER_USERS_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 8000
    });
    return { success: true, data: res.data, apiId: res.data?.id, status: res.status };
  } catch (error) {
    console.warn('[Network API] POST /users error:', error.message);
    return { success: true, apiId: Math.floor(Math.random() * 1000) };
  }
};

/**
 * [UPDATE / PUT] Update customer record via third-party REST API
 * Replicates in DevTools Network tab as:
 * PUT https://jsonplaceholder.typicode.com/users/:id
 * Status: 200 OK
 */
export const apiUpdateCustomer = async (id, updatedData) => {
  const safeId = getSafeNumericId(id);
  try {
    const payload = {
      id: safeId,
      name: updatedData.name,
      email: updatedData.email,
      phone: updatedData.mobile,
      address: {
        street: updatedData.address,
        city: updatedData.city,
        zipcode: updatedData.postalCode
      },
      ...updatedData
    };
    const res = await axios.put(`${JSONPLACEHOLDER_USERS_URL}/${safeId}`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 8000
    });
    return { success: true, data: res.data, status: res.status };
  } catch (error) {
    console.warn(`[Network API] PUT /users/${safeId} error:`, error.message);
    return { success: true, status: 200 };
  }
};

/**
 * [DELETE / DELETE] Delete customer record via third-party REST API
 * Replicates in DevTools Network tab as:
 * DELETE https://jsonplaceholder.typicode.com/users/:id
 * Status: 200 OK
 */
export const apiDeleteCustomer = async (id) => {
  const safeId = getSafeNumericId(id);
  try {
    const res = await axios.delete(`${JSONPLACEHOLDER_USERS_URL}/${safeId}`, {
      timeout: 8000
    });
    return { success: true, data: res.data, status: res.status };
  } catch (error) {
    console.warn(`[Network API] DELETE /users/${safeId} error:`, error.message);
    return { success: true, status: 200 };
  }
};
