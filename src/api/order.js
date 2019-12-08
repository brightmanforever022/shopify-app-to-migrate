import request from '@/utils/request'

export function createOrder (data) {
  return request({
    url: `/orders`,
    method: 'post',
    data: data
  })
}
