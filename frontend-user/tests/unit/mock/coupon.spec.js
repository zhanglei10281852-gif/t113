/**
 * Mock Coupon 模块测试
 */

const mockHandlers = []
jest.mock('mockjs', () => ({
  mock: jest.fn((pattern, method, handler) => {
    mockHandlers.push({ pattern: pattern.toString(), method, handler })
  })
}))

describe('Mock Coupon', () => {
  let getCoupons

  beforeAll(() => {
    require('@/mock/modules/coupon')
    getCoupons = mockHandlers[0].handler
  })

  it('获取全部优惠券', () => {
    const res = getCoupons({ url: '/api/coupons' })
    expect(res.code).toBe(200)
    expect(res.data.length).toBe(5)
  })

  it('按类型筛选 - available', () => {
    const res = getCoupons({ url: '/api/coupons?type=available' })
    expect(res.code).toBe(200)
    res.data.forEach(c => expect(c.type).toBe('available'))
  })

  it('按类型筛选 - used', () => {
    const res = getCoupons({ url: '/api/coupons?type=used' })
    res.data.forEach(c => expect(c.type).toBe('used'))
  })

  it('按类型筛选 - expired', () => {
    const res = getCoupons({ url: '/api/coupons?type=expired' })
    res.data.forEach(c => expect(c.type).toBe('expired'))
  })

  it('type=all 返回全部', () => {
    const res = getCoupons({ url: '/api/coupons?type=all' })
    expect(res.data.length).toBe(5)
  })
})
