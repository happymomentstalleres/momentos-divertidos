import api from './api'

export const productService = {
  // Productos públicos con filtros opcionales
  getAll: (params) => api.get('/products', { params }),

  // Todos los productos para admin
  getAllAdmin: (params) => api.get('/products/admin/all', { params }),

  // Un solo producto
  getById: (id) => api.get(`/products/${id}`),

  // Crear producto (multipart/form-data)
  create: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // Actualizar producto
  update: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // Eliminar producto
  delete: (id) => api.delete(`/products/${id}`),
}
