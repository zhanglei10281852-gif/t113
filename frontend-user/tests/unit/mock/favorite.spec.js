/**
 * Mock Favorite 模块测试
 */

const mockHandlers = []
jest.mock('mockjs', () => ({
  mock: jest.fn((pattern, method, handler) => {
    mockHandlers.push({ pattern: pattern.toString(), method, handler })
  })
}))

describe('Mock Favorite', () => {
  let getFavorites, addFavorite, removeFavorite, checkFavorite

  beforeAll(() => {
    require('@/mock/modules/favorite')
    getFavorites = mockHandlers.find(h => h.method === 'get' && h.pattern.includes('favorites$')).handler
    addFavorite = mockHandlers.find(h => h.method === 'post').handler
    removeFavorite = mockHandlers.find(h => h.method === 'delete').handler
    checkFavorite = mockHandlers.find(h => h.pattern.includes('check')).handler
  })

  it('初始收藏列表为空', () => {
    const res = getFavorites()
    expect(res.code).toBe(200)
    expect(res.data).toEqual([])
  })

  it('添加收藏', () => {
    const res = addFavorite({ body: JSON.stringify({ productId: 101, name: 'iPhone', image: 'img.jpg', price: 8999 }) })
    expect(res.code).toBe(200)
    expect(getFavorites().data).toHaveLength(1)
  })

  it('重复收藏返回 400', () => {
    const res = addFavorite({ body: JSON.stringify({ productId: 101 }) })
    expect(res.code).toBe(400)
  })

  it('检查已收藏商品返回 true', () => {
    const res = checkFavorite({ url: '/api/favorites/check/101' })
    expect(res.data).toBe(true)
  })

  it('检查未收藏商品返回 false', () => {
    const res = checkFavorite({ url: '/api/favorites/check/999' })
    expect(res.data).toBe(false)
  })

  it('取消收藏', () => {
    removeFavorite({ url: '/api/favorites/101' })
    expect(getFavorites().data).toHaveLength(0)
  })
})
