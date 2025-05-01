import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}` // Attach token to each request
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refresh_token')
      try {
        const response = await axios.post('/users/refresh', {
          refresh_token: refreshToken,
        })
        const { access_token, refresh_token } = response.data

        // Update the access and refresh tokens in localStorage
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)

        // Update the authorization header with the new access token
        axios.defaults.headers['Authorization'] = `Bearer ${access_token}`
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`

        return axios(originalRequest) // Retry the original request with the new token
      } catch (refreshError) {
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default API
