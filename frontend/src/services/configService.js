import api from './api'

export const configService = {
  get: () => api.get('/config'),
  update: (formData) => api.put('/config', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}
