import request from '@/utils/request'

export function getSettings (id) {
  return request({
    url: `/settings`,
    method: 'get'
  })
}
