import request from './request'

export function getCoupons(params) {
  return request({ url: '/api/coupons', method: 'get', params })
}
