import request from './request'

export function getFavorites() {
  return request({ url: '/api/favorites', method: 'get' })
}

export function addFavorite(data) {
  return request({ url: '/api/favorites', method: 'post', data })
}

export function removeFavorite(productId) {
  return request({ url: `/api/favorites/${productId}`, method: 'delete' })
}

export function checkFavorite(productId) {
  return request({ url: `/api/favorites/check/${productId}`, method: 'get' })
}
