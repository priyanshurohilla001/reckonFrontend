import axios from 'axios'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const api = axios.create({
  baseURL: SERVER_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getCategoryEntries = async (category) => {
  try {
    const response = await api.get(`/entries/${category}`)
    return response.data
  } catch (error) {
    console.error('Error fetching category entries:', error)
    return []
  }
}

export default api
