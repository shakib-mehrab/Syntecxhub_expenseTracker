import axios from 'axios'
import { API_BASE_URL } from '../config'

const api = axios.create({
  baseURL: API_BASE_URL,
})

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete api.defaults.headers.common.Authorization
}

export const authApi = {
  login: async (payload) => {
    const { data } = await api.post('/auth/login', payload)
    return data
  },
  signup: async (payload) => {
    const { data } = await api.post('/auth/signup', payload)
    return data
  },
}

export const transactionsApi = {
  list: async (type) => {
    const { data } = await api.get('/transactions', {
      params: type ? { type } : undefined,
    })
    return data
  },
  create: async (payload) => {
    const { data } = await api.post('/transactions', payload)
    return data
  },
  remove: async (id) => {
    const { data } = await api.delete(`/transactions/${id}`)
    return data
  },
  export: async (type) => {
    const response = await api.get('/transactions/export', {
      params: type ? { type } : undefined,
      responseType: 'blob',
    })
    return response
  },
}

export default api