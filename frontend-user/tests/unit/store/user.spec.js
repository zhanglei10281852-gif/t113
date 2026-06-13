import userModule from '@/store/modules/user'

jest.mock('@/api/auth', () => ({
  login: jest.fn(),
  register: jest.fn()
}))

const { login, register } = require('@/api/auth')

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: key => store[key] || null,
    setItem: (key, val) => { store[key] = String(val) },
    removeItem: key => { delete store[key] },
    clear: () => { store = {} }
  }
})()
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

describe('User Store', () => {
  let state

  beforeEach(() => {
    localStorage.clear()
    state = { token: '', userInfo: null }
    jest.clearAllMocks()
  })

  describe('getters', () => {
    it('isLoggedIn 有 token 时返回 true', () => {
      state.token = 'abc123'
      expect(userModule.getters.isLoggedIn(state)).toBe(true)
    })

    it('isLoggedIn 无 token 时返回 false', () => {
      expect(userModule.getters.isLoggedIn(state)).toBe(false)
    })

    it('username 有用户信息时返回用户名', () => {
      state.userInfo = { username: 'demo' }
      expect(userModule.getters.username(state)).toBe('demo')
    })

    it('username 无用户信息时返回空字符串', () => {
      expect(userModule.getters.username(state)).toBe('')
    })
  })

  describe('mutations', () => {
    it('SET_TOKEN 设置 token 并持久化', () => {
      userModule.mutations.SET_TOKEN(state, 'token123')
      expect(state.token).toBe('token123')
      expect(localStorage.getItem('ecommerce_token')).toBe('token123')
    })

    it('SET_USER_INFO 设置用户信息并持久化', () => {
      const info = { username: 'demo', phone: '13800000000' }
      userModule.mutations.SET_USER_INFO(state, info)
      expect(state.userInfo).toEqual(info)
      expect(JSON.parse(localStorage.getItem('ecommerce_user'))).toEqual(info)
    })

    it('CLEAR_AUTH 清除认证信息', () => {
      state.token = 'abc'
      state.userInfo = { username: 'demo' }
      localStorage.setItem('ecommerce_token', 'abc')
      localStorage.setItem('ecommerce_user', '{}')

      userModule.mutations.CLEAR_AUTH(state)
      expect(state.token).toBe('')
      expect(state.userInfo).toBeNull()
      expect(localStorage.getItem('ecommerce_token')).toBeNull()
      expect(localStorage.getItem('ecommerce_user')).toBeNull()
    })
  })

  describe('actions', () => {
    it('login 成功后设置 token 和用户信息', async () => {
      const commit = jest.fn()
      const mockRes = {
        data: {
          token: 'jwt-token',
          userInfo: { username: 'demo', phone: '13800000000' }
        }
      }
      login.mockResolvedValue(mockRes)

      const result = await userModule.actions.login({ commit }, { username: 'demo', password: '123456' })
      expect(login).toHaveBeenCalledWith({ username: 'demo', password: '123456' })
      expect(commit).toHaveBeenCalledWith('SET_TOKEN', 'jwt-token')
      expect(commit).toHaveBeenCalledWith('SET_USER_INFO', mockRes.data.userInfo)
      expect(result).toEqual(mockRes)
    })

    it('register 调用注册 API', async () => {
      register.mockResolvedValue({ code: 200 })
      await userModule.actions.register({}, { username: 'new', password: '123456', phone: '13900000000' })
      expect(register).toHaveBeenCalled()
    })

    it('logout 清除认证并清空购物车', () => {
      const commit = jest.fn()
      userModule.actions.logout({ commit })
      expect(commit).toHaveBeenCalledWith('CLEAR_AUTH')
      expect(commit).toHaveBeenCalledWith('cart/SET_ITEMS', [], { root: true })
    })
  })
})
