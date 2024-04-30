import axios from 'axios'

export const instance = axios.create({
  baseURL: '//127.0.0.1:8000/api/',
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("axios error: ", error)
    return Promise.reject(error)
  },
)
