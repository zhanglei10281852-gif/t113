/**
 * 路由配置与守卫测试
 */

let routerConfig = null
let beforeEachCb = null

// Mock vue-router: 捕获构造参数和 beforeEach
jest.mock('vue-router', () => {
  const Router = function (config) {
    routerConfig = config
    this.beforeEach = (cb) => { beforeEachCb = cb }
  }
  return Router
})

jest.mock('vue', () => ({ use: jest.fn() }))

const mockStore = { getters: { 'user/isLoggedIn': false } }
jest.mock('@/store', () => mockStore)

// 这行会执行 router/index.js 的全部代码
require('@/router/index')

describe('路由配置', () => {
  it('routes 数组包含 16 条路由', () => {
    expect(routerConfig.routes.length).toBe(16)
  })

  it('/ 重定向到 /home', () => {
    expect(routerConfig.routes.find(r => r.path === '/').redirect).toBe('/home')
  })

  it('需要认证的路由设置了 requireAuth', () => {
    ['/cart', '/profile', '/checkout', '/payment', '/pay-result', '/orders', '/address', '/favorites', '/coupons'].forEach(p => {
      expect(routerConfig.routes.find(r => r.path === p).meta.requireAuth).toBe(true)
    })
  })

  it('公开路由没有 requireAuth', () => {
    ['/home', '/category', '/login', '/register', '/search'].forEach(p => {
      expect(routerConfig.routes.find(r => r.path === p).meta?.requireAuth).toBeFalsy()
    })
  })

  it('hideTabbar 配置正确', () => {
    ['/login', '/register', '/product/:id', '/search', '/checkout', '/payment', '/pay-result', '/orders', '/address', '/favorites', '/coupons'].forEach(p => {
      expect(routerConfig.routes.find(r => r.path === p).meta.hideTabbar).toBe(true)
    })
  })

  it('TabBar 页面不隐藏', () => {
    ['/home', '/category', '/cart', '/profile'].forEach(p => {
      expect(routerConfig.routes.find(r => r.path === p).meta?.hideTabbar).toBeFalsy()
    })
  })

  it('每个路由有 component 或 redirect', () => {
    routerConfig.routes.forEach(r => {
      expect(r.component || r.redirect).toBeTruthy()
    })
  })

  it('懒加载组件是函数', () => {
    routerConfig.routes.filter(r => r.component).forEach(r => {
      expect(typeof r.component).toBe('function')
    })
  })
})

describe('beforeEach 守卫', () => {
  let next
  beforeEach(() => {
    next = jest.fn()
    mockStore.getters['user/isLoggedIn'] = false
  })

  it('设置页面标题', () => {
    beforeEachCb({ meta: { title: '购物车' }, fullPath: '/cart' }, {}, next)
    expect(document.title).toBe('购物车')
  })

  it('无 title 时默认"鲜购"', () => {
    beforeEachCb({ meta: {}, fullPath: '/' }, {}, next)
    expect(document.title).toBe('鲜购')
  })

  it('未登录访问 requireAuth 页面重定向到登录页', () => {
    beforeEachCb({ path: '/cart', meta: { requireAuth: true }, fullPath: '/cart' }, {}, next)
    expect(next).toHaveBeenCalledWith({ path: '/login', query: { redirect: '/cart' } })
  })

  it('已登录访问 requireAuth 页面正常通过', () => {
    mockStore.getters['user/isLoggedIn'] = true
    beforeEachCb({ path: '/cart', meta: { requireAuth: true }, fullPath: '/cart' }, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('访问公开页面正常通过', () => {
    beforeEachCb({ path: '/home', meta: {}, fullPath: '/home' }, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('未登录访问 /orders 携带 redirect', () => {
    beforeEachCb({ path: '/orders', meta: { requireAuth: true }, fullPath: '/orders' }, {}, next)
    expect(next).toHaveBeenCalledWith({ path: '/login', query: { redirect: '/orders' } })
  })
})
