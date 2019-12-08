import axios from 'axios'

const request = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Accept': 'application-json',
    'Content-type': 'application/json'
  }
})

request.interceptors.request.use(
  config => {
    let token = document.head.querySelector('meta[name="csrf-token"]')
    if (token) {
      config.headers.common['x-csrf-token'] = token.content
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
