import axios from 'axios'
//network port 
const hostname = window.location.hostname
const port = window.location.port

const instance = axios.create({
  baseURL: `http://${hostname}:${port}`, // URL DE BACKEND
  withCredentials: true,
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance