import request from '../helper/request'

export function loadVariantList (params) {
  return request({
    url: '/products/listvariants',
    method: 'get',
    params: params
  })
}

export function loadProducts (params) {
  return request({
    url: '/products',
    method: 'get',
    params: params
  })
}
