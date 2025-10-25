// API configuration
const isDevelopment = import.meta.env.DEV;

export const getApiUrl = (endpoint) => {
  // In development, use relative URLs to work with Vite's proxy
  if (isDevelopment) {
    return endpoint;
  }
  // In production, use the full URL
  return `${import.meta.env.VITE_API_URL}${endpoint}`;
};

export default {
  // Auth endpoints
  login: () => getApiUrl('/api/login'),
  register: () => getApiUrl('/api/register'),
  
  // Equipment endpoints
  getAllEquipment: () => getApiUrl('/api/equipment'),
  getEquipmentById: (id) => getApiUrl(`/api/equipment/${id}`),
  getMyEquipment: (userId) => getApiUrl(`/api/equipment/my-equipment/${userId}`),
  
  // Checkout endpoints
  checkout: () => getApiUrl('/api/checkout'),
  returnEquipment: () => getApiUrl('/api/equipment/return'),
  
  // Admin endpoints
  getPendingUsers: () => getApiUrl('/api/admin/pending-users'),
  approveUser: (id) => getApiUrl(`/api/admin/approve/${id}`),
  rejectUser: (id) => getApiUrl(`/api/admin/reject/${id}`),
  
  // Grade Endpoint
  getGrades: () => getApiUrl("/api/grades"),

  //edit equipment endpoints
  updateEquipment: (id) => `/api/equipment/${id}`,
  deleteEquipment: (id) => `/api/equipment/${id}`,

};

  