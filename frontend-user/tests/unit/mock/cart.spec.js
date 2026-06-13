/**
 * Mock Cart 模块测试
 */

const mockHandlers = []
jest.mock('mockjs', () => ({
  mock: jest.fn((pattern, method, handler) => {
    mockHandlers.push({ pattern: pattern.toString(), method, handler })
  })
}))

describe('Mock Cart', () => {
  let getCart, addToCart, updateCart, deleteCart, checkAllCart

  beforeAll(() => {
    require('@/mock/modules/cart')
    // 按 method + pattern 匹配
    getCart = mockHandlers.find(h => h.method === 'get' && h.pattern.includes('cart$')).handler
    addToCart = mockHandlers.find(h => h.method === 'post' && h.pattern.includes('cart$')).handler
    updateCart = mockHandlers.find(h => h.method === 'put' && h.pattern.includes('cart\\/\\d+')).handler
    deleteCart = mockHandlers.find(h => h.method === 'delete').handler
    checkAllCart = mockHandlers.find(h => h.pattern.includes('check-all')).handler
  })

  it('获取购物车返回默认商品', () => {
    const res = getCart()
    expect(res.code).toBe(200)
    expect(res.data.length).toBeGreaterThanOrEqual(2)
  })

  it('添加新商品到购物车', () => {
    const before = getCart().data.length
    addToCart({ body: JSON.stringify({ productId: 999, name: '测试商品', price: 100, spec: '默认' }) })
    const after = getCart().data.length
    expect(after).toBe(before + 1)
  })

  it('添加已有商品增加数量', () => {
    const item = getCart().data.find(i => i.productId === 999)
    const oldQty = item.quantity
    addToCart({ body: JSON.stringify({ productId: 999, spec: '默认', quantity: 2 }) })
    const updated = getCart().data.find(i => i.productId === 999)
    expect(updated.quantity).toBe(oldQty + 2)
  })

  it('更新购物车项数量', () => {
    const res = updateCart({ url: '/api/cart/1', body: JSON.stringify({ quantity: 5 }) })
    expect(res.code).toBe(200)
    const item = getCart().data.find(i => i.id === 1)
    expect(item.quantity).toBe(5)
  })

  it('更新购物车项选中状态', () => {
    updateCart({ url: '/api/cart/1', body: JSON.stringify({ checked: false }) })
    const item = getCart().data.find(i => i.id === 1)
    expect(item.checked).toBe(false)
  })

  it('更新不存在的购物车项返回 404', () => {
    const res = updateCart({ url: '/api/cart/9999', body: JSON.stringify({ quantity: 1 }) })
    expect(res.code).toBe(404)
  })

  it('全选购物车', () => {
    checkAllCart({ body: JSON.stringify({ checked: true }) })
    const items = getCart().data
    items.forEach(i => expect(i.checked).toBe(true))
  })

  it('取消全选', () => {
    checkAllCart({ body: JSON.stringify({ checked: false }) })
    const items = getCart().data
    items.forEach(i => expect(i.checked).toBe(false))
  })

  it('删除购物车项', () => {
    const before = getCart().data.length
    deleteCart({ url: '/api/cart/1' })
    const after = getCart().data.length
    expect(after).toBe(before - 1)
  })
})
