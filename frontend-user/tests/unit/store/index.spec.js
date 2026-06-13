/**
 * Store 入口测试
 * 验证 Vuex store 正确注册所有模块
 */

jest.mock('vue', () => ({ use: jest.fn() }))

// Mock 所有 store 模块，避免拉到 api/vant 依赖
jest.mock('@/store/modules/user', () => ({ namespaced: true, state: {} }))
jest.mock('@/store/modules/cart', () => ({ namespaced: true, state: {} }))
jest.mock('@/store/modules/product', () => ({ namespaced: true, state: {} }))
jest.mock('@/store/modules/checkout', () => ({ namespaced: true, state: {} }))

let storeConfig = null
jest.mock('vuex', () => {
  const Store = jest.fn(config => {
    storeConfig = config
    return { modules: config.modules }
  })
  return { Store, default: { Store } }
})

describe('Store Index', () => {
  let storeInstance

  beforeAll(() => {
    storeInstance = require('@/store/index').default
  })

  it('导出 store 实例', () => {
    expect(storeInstance).toBeDefined()
  })

  it('注册了 user 模块', () => {
    expect(storeConfig.modules).toHaveProperty('user')
  })

  it('注册了 cart 模块', () => {
    expect(storeConfig.modules).toHaveProperty('cart')
  })

  it('注册了 product 模块', () => {
    expect(storeConfig.modules).toHaveProperty('product')
  })

  it('注册了 checkout 模块', () => {
    expect(storeConfig.modules).toHaveProperty('checkout')
  })

  it('共注册 4 个模块', () => {
    expect(Object.keys(storeConfig.modules)).toHaveLength(4)
  })
})
