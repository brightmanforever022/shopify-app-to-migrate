import request from '@/utils/request'

export function uploadFile (data) {
  return request({
    url: `/orders/uploadfile`,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}