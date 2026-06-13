import request from './request'

export function getCart() {
  return request({ url: '/api/cart', method: 'get' })
}

export function addToCart(data) {
  return request({ url: '/api/cart', method: 'post', data })
}

export function updateCartItem(id, data) {
  return request({ url: `/api/cart/${id}`, method: 'put', data })
}

export function deleteCartItem(id) {
  return request({ url: `/api/cart/${id}`, method: 'delete' })
}

export function checkAll(checked) {
  return request({ url: '/api/cart/check-all', method: 'put', data: { checked } })
}
