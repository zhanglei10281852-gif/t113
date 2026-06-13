/**
 * Mock Auth 模块测试
 */

const mockHandlers = {}

// auth.js does: import Mock from 'mockjs'; Mock.mock(pattern, method, handler)
// So we need a default export object with a .mock method
jest.mock('mockjs', () => {
  return {
    __esModule: true,
    default: {
      mock: jest.fn((pattern, method, handler) => {
        if (typeof method === 'string' && typeof handler === 'function') {
          mockHandlers[method + ':' + pattern] = handler
        }
      })
    }
  }
})

describe('Mock Auth', () => {
  let loginHandler, registerHandler

  beforeAll(() => {
    require('@/mock/modules/auth')
    const keys = Object.keys(mockHandlers)
    loginHandler = mockHandlers[keys.find(k => k.includes('login'))]
    registerHandler = mockHandlers[keys.find(k => k.includes('register'))]
  })

  describe('登录', () => {
    it('正确账号密码返回 200', () => {
      const res = loginHandler({ body: JSON.stringify({ username: 'demo', password: '123456' }) })
      expect(res.code).toBe(200)
      expect(res.data).toBeDefined()
      expect(res.data.userInfo.username).toBe('demo')
    })

    it('test 账号也能登录', () => {
      const res = loginHandler({ body: JSON.stringify({ username: 'test', password: '123456' }) })
      expect(res.code).toBe(200)
      expect(res.data.userInfo.username).toBe('test')
    })

    it('错误密码返回 401', () => {
      const res = loginHandler({ body: JSON.stringify({ username: 'demo', password: 'wrong' }) })
      expect(res.code).toBe(401)
      expect(res.data).toBeNull()
    })

    it('不存在的用户返回 401', () => {
      const res = loginHandler({ body: JSON.stringify({ username: 'nobody', password: '123456' }) })
      expect(res.code).toBe(401)
    })
  })

  describe('注册', () => {
    it('新用户注册成功', () => {
      const res = registerHandler({ body: JSON.stringify({ username: 'authtest_new', password: '123', phone: '139' }) })
      expect(res.code).toBe(200)
    })

    it('已存在用户名返回 400', () => {
      const res = registerHandler({ body: JSON.stringify({ username: 'demo', password: '123', phone: '139' }) })
      expect(res.code).toBe(400)
    })
  })
})
