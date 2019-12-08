import request from '@/utils/request'

export function get (id) {
  return request({
    url: `/products/${id}`,
    method: 'get'
  })
}
