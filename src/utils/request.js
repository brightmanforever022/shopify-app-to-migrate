import axios from 'axios'
import config from '@/config.json'

const request = axios.create({
  baseURL: `${[config.API_HOST, config.API_NAMESPACE].join('/')}`,
  headers: {
    'Accept': 'application-json',
    'Content-type': 'application/json'
  }
})

request.interceptors.request.use(
  config => {
    let token = window.D4S_TOKEN
    if (token) {
      config.headers.common['d4s-token'] = token
    } else {
      console.log('CSRF token not fount')
    }
    return config
  },
  error => {
    console.log('// Something with request error')
    console.log(error)
    Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => response,
  error => {
    console.log('err ' + error)
    return Promise.reject(error)
  }
)

export default request
