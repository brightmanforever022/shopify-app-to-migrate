import request from '@/utils/request'

export function createOrder (data) {
  return request({
    url: `/orders`,
    method: 'post',
    data: data
  })
}

export function createQuote (data) {
  return request({
    url: `/orders/quote`,
    method: 'post',
    data: data
  })
}

export function createQuoteWithCart (data) {
  return request({
    url: `/orders/quotecart`,
    method: 'post',
    data: data
  })
}