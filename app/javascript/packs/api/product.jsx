import request from '../helper/request'

export function loadProducts (params) {
  return request({
    url: '/products',
    method: 'get',
    params: params
  })
}
