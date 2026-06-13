import request from './request'

export function getAddresses() {
  return request({ url: '/api/addresses', method: 'get' })
}

export function addAddress(data) {
  return request({ url: '/api/addresses', method: 'post', data })
}

export function updateAddress(id, data) {
  return request({ url: `/api/addresses/${id}`, method: 'put', data })
}

export function deleteAddress(id) {
  return request({ url: `/api/addresses/${id}`, method: 'delete' })
}
