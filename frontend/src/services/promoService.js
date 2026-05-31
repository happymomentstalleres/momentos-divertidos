import api from './api'

export const promoService = {
  getActive: ()        => api.get('/promos/active'),
  getAll:    ()        => api.get('/promos'),
  create:    (data)    => api.post('/promos', data),
  update:    (id,data) => api.put(`/promos/${id}`, data),
  delete:    (id)      => api.delete(`/promos/${id}`),
}
