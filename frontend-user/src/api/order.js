import request from './request'

export function createOrder(data) {
  return request({ url: '/api/orders', method: 'post', data })
}

export function getOrders(params) {
  return request({ url: '/api/orders', method: 'get', params })
}

export function cancelOrder(id) {
  return request({ url: `/api/orders/${id}/cancel`, method: 'put' })
}

export function payOrder(id) {
  return request({ url: `/api/orders/${id}/pay`, method: 'put' })
}

export function confirmOrder(id) {
  return request({ url: `/api/orders/${id}/confirm`, method: 'put' })
}
