import api from './api'

export const orderService = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
}
