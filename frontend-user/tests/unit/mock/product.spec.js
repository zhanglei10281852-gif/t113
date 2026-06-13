/**
 * Mock Product 模块测试
 */

const mockHandlers = []
jest.mock('mockjs', () => ({
  mock: jest.fn((pattern, method, handler) => {
    mockHandlers.push({ pattern, method, handler })
  })
}))

describe('Mock Product', () => {
  let handlers = {}

  beforeAll(() => {
    require('@/mock/modules/product')
    // 按 URL 模式分类 handler
    mockHandlers.forEach(h => {
      const key = h.pattern.toString()
      if (key.includes('banners')) handlers.banners = h.handler
      else if (key.includes('categories')) handlers.categories = h.handler
      else if (key.includes('recommend')) handlers.recommend = h.handler
      else if (key.includes('products\\/\\d+')) handlers.detail = h.handler
      else if (key.includes('products')) handlers.list = h.handler
    })
  })

  it('获取轮播图返回数组', () => {
    const res = handlers.banners()
    expect(res.code).toBe(200)
    expect(res.data.length).toBeGreaterThan(0)
    expect(res.data[0]).toHaveProperty('image')
  })

  it('获取分类返回 8 个分类', () => {
    const res = handlers.categories()
    expect(res.code).toBe(200)
    expect(res.data).toHaveLength(8)
    expect(res.data[0]).toHaveProperty('name')
    expect(res.data[0]).toHaveProperty('icon')
  })

  it('获取推荐商品', () => {
    const res = handlers.recommend()
    expect(res.code).toBe(200)
    expect(res.data.length).toBeGreaterThan(0)
    expect(res.data[0]).toHaveProperty('price')
  })

  it('获取商品详情 - 存在的商品', () => {
    const res = handlers.detail({ url: '/api/products/101' })
    expect(res.code).toBe(200)
    expect(res.data.id).toBe(101)
    expect(res.data.images).toBeDefined()
    expect(res.data.specs).toBeDefined()
  })

  it('获取商品详情 - 不存在的商品', () => {
    const res = handlers.detail({ url: '/api/products/99999' })
    expect(res.code).toBe(404)
  })

  it('获取商品列表 - 无筛选', () => {
    const res = handlers.list({ url: '/api/products' })
    expect(res.code).toBe(200)
    expect(res.data.list.length).toBeGreaterThan(0)
    expect(res.data).toHaveProperty('total')
  })

  it('获取商品列表 - 按分类筛选', () => {
    const res = handlers.list({ url: '/api/products?categoryId=1' })
    expect(res.code).toBe(200)
    res.data.list.forEach(p => {
      expect(p.categoryId).toBe(1)
    })
  })

  it('获取商品列表 - 按关键词搜索', () => {
    const res = handlers.list({ url: '/api/products?keyword=iPhone' })
    expect(res.code).toBe(200)
    expect(res.data.list.length).toBeGreaterThan(0)
  })

  it('获取商品列表 - 分页', () => {
    const res = handlers.list({ url: '/api/products?page=1&pageSize=2' })
    expect(res.code).toBe(200)
    expect(res.data.list.length).toBeLessThanOrEqual(2)
    expect(res.data.page).toBe(1)
    expect(res.data.pageSize).toBe(2)
  })

  it('商品数据稳定（seededRandom）', () => {
    const res1 = handlers.recommend()
    const res2 = handlers.recommend()
    expect(res1.data).toEqual(res2.data)
  })
})
