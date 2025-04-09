import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://dev.tapgo.cc/test',
})

export default boot(({ app }) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')

      if (token) {
        const pureToken = token.replace('Bearer ', '')
        config.headers.Authorization = `Bearer ${pureToken}`
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
