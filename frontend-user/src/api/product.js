import request from './request'

export function getBanners() {
  return request({ url: '/api/banners', method: 'get' })
}

export function getCategories() {
  return request({ url: '/api/categories', method: 'get' })
}

export function getRecommendProducts() {
  return request({ url: '/api/products/recommend', method: 'get' })
}

export function getProducts(params) {
  return request({ url: '/api/products', method: 'get', params })
}

export function getProductDetail(id) {
  return request({ url: `/api/products/${id}`, method: 'get' })
}
