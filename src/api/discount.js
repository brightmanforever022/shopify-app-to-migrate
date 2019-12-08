import request from '@/utils/request'

export function getDiscount (discountCode) {
  return request({
    url: `/discounts/${discountCode}`,
    method: 'get'
  })
}
