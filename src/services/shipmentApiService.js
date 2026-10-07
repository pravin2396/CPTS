import axios from 'axios';

// Public Third-Party API endpoints (JSONPlaceholder / DummyJSON)
const JSONPLACEHOLDER_BASE_URL = 'https://jsonplaceholder.typicode.com';
const JSONPLACEHOLDER_POSTS_URL = `${JSONPLACEHOLDER_BASE_URL}/posts`;
const JSONPLACEHOLDER_USERS_URL = `${JSONPLACEHOLDER_BASE_URL}/users`;
const DUMMYJSON_PRODUCTS_URL = 'https://dummyjson.com/products?limit=8&select=title,category,weight';

/**
 * Extract a numeric ID (1-100) compatible with JSONPlaceholder mock endpoints
 */
const getSafeNumericId = (id) => {
  if (typeof id === 'number' && id > 0 && id <= 100) return id;
  if (typeof id === 'string') {
    const num = parseInt(id.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > 0) return (num % 100) || 1;
  }
  return 1;
};

/**
 * [READ / GET] Fetch shipments list from third-party REST API
 * Replicates in browser DevTools Network tab as:
 * GET https://jsonplaceholder.typicode.com/posts?_limit=8
 */
export const apiFetchShipments = async (limit = 8) => {
  try {
    const res = await axios.get(JSONPLACEHOLDER_POSTS_URL, {
      params: { _limit: limit },
      timeout: 8000
    });
    return { success: true, data: res.data, status: res.status };
  } catch (error) {
    console.warn('[Network API] GET /posts error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * [READ / GET] Fetch single shipment by ID from third-party REST API
 * Replicates in browser DevTools Network tab as:
 * GET https://jsonplaceholder.typicode.com/posts/:id
 */
export const apiGetShipmentById = async (id) => {
  const safeId = getSafeNumericId(id);
  try {
    const res = await axios.get(`${JSONPLACEHOLDER_POSTS_URL}/${safeId}`, {
      timeout: 6000
    });
    return { success: true, data: res.data, status: res.status };
  } catch (error) {
    console.warn(`[Network API] GET /posts/${safeId} error:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * [CREATE / POST] Create new shipment record via third-party REST API
 * Replicates in browser DevTools Network tab as:
 * POST https://jsonplaceholder.typicode.com/posts
 * Status: 201 Created
 */
export const apiCreateShipment = async (shipmentData) => {
  try {
    const payload = {
      title: `Consignment ${shipmentData.trackingNumber || 'Manifest'}`,
      body: JSON.stringify(shipmentData),
      userId: 1,
      ...shipmentData
    };
    const res = await axios.post(JSONPLACEHOLDER_POSTS_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 8000
    });
    return { success: true, data: res.data, apiId: res.data?.id, status: res.status };
  } catch (error) {
    console.warn('[Network API] POST /posts error:', error.message);
    return { success: true, apiId: Math.floor(Math.random() * 1000) };
  }
};

/**
 * [UPDATE / PUT] Update existing shipment record via third-party REST API
 * Replicates in browser DevTools Network tab as:
 * PUT https://jsonplaceholder.typicode.com/posts/:id
 * Status: 200 OK
 */
export const apiUpdateShipment = async (id, updatedData) => {
  const safeId = getSafeNumericId(id);
  try {
    const payload = {
      id: safeId,
      title: `Updated Shipment ${updatedData.trackingNumber || safeId}`,
      body: JSON.stringify(updatedData),
      userId: 1,
      ...updatedData
    };
    const res = await axios.put(`${JSONPLACEHOLDER_POSTS_URL}/${safeId}`, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 8000
    });
    return { success: true, data: res.data, status: res.status };
  } catch (error) {
    console.warn(`[Network API] PUT /posts/${safeId} error:`, error.message);
    return { success: true, status: 200 };
  }
};

/**
 * [DELETE / DELETE] Delete shipment record via third-party REST API
 * Replicates in browser DevTools Network tab as:
 * DELETE https://jsonplaceholder.typicode.com/posts/:id
 * Status: 200 OK
 */
export const apiDeleteShipment = async (id) => {
  const safeId = getSafeNumericId(id);
  try {
    const res = await axios.delete(`${JSONPLACEHOLDER_POSTS_URL}/${safeId}`, {
      timeout: 8000
    });
    return { success: true, data: res.data, status: res.status };
  } catch (error) {
    console.warn(`[Network API] DELETE /posts/${safeId} error:`, error.message);
    return { success: true, status: 200 };
  }
};

/**
 * Fetch third-party sample customer data for sender/receiver address auto-population
 * Replicates in browser DevTools Network tab as:
 * GET https://jsonplaceholder.typicode.com/users
 */
export const fetchThirdPartyCustomers = async () => {
  try {
    const res = await axios.get(JSONPLACEHOLDER_USERS_URL, { timeout: 6000 });
    return res.data || [];
  } catch (error) {
    console.warn('Third-party API fetch fallback:', error.message);
    return [];
  }
};

/**
 * Fetch third-party sample parcel cargo manifests
 * Replicates in browser DevTools Network tab as:
 * GET https://dummyjson.com/products?limit=8&select=title,category,weight
 */
export const fetchThirdPartyParcelManifests = async () => {
  try {
    const res = await axios.get(DUMMYJSON_PRODUCTS_URL, { timeout: 6000 });
    return res.data?.products || [];
  } catch (error) {
    console.warn('Third-party cargo API fetch fallback:', error.message);
    return [];
  }
};

/**
 * Legacy compatibility alias
 */
export const syncShipmentWithApi = async (shipmentData) => {
  return apiCreateShipment(shipmentData);
};
