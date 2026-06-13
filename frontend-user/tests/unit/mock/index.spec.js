/**
 * Mock 入口测试
 */

jest.mock('mockjs', () => ({
  mock: jest.fn(),
  setup: jest.fn(),
  Mock: { mock: jest.fn(t => t) }
}))

// Mock 所有子模块避免副作用
jest.mock('@/mock/modules/auth', () => {})
jest.mock('@/mock/modules/product', () => {})
jest.mock('@/mock/modules/cart', () => {})
jest.mock('@/mock/modules/order', () => {})
jest.mock('@/mock/modules/address', () => {})
jest.mock('@/mock/modules/favorite', () => {})
jest.mock('@/mock/modules/coupon', () => {})

describe('Mock Index', () => {
  let Mock, consoleSpy

  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    Mock = require('mockjs')
    require('@/mock/index')
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  it('调用 Mock.setup 设置超时', () => {
    expect(Mock.setup).toHaveBeenCalledWith({ timeout: '200-400' })
  })

  it('输出启动日志', () => {
    expect(consoleSpy).toHaveBeenCalledWith('[Mock] Mock 数据服务已启动')
  })
})
