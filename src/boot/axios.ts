import axios, { AxiosInstance } from 'axios'
import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar'

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}

axios.interceptors.request.use(
  config => {
    config.baseURL = '/api/'
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  }
)

axios.interceptors.response.use(
  response => {
    return Promise.resolve(response)
  },
  error => {
    switch (error.response.status) {
      case 401:
        window.location.href = '/#/logout'
    }
    Notify.create({
      message: `[${error.response.statusText}]${error.response.data}`,
      position: 'top',
      color: 'negative'
    })
    return Promise.reject(error)
  }
)

export default boot(({ Vue }) => {
  Vue.prototype.$axios = axios
})
