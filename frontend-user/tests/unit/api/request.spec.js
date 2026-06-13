/**
 * request.js 请求封装测试
 * 通过 moduleNameMapper 将 vant 映射到 __mocks__/vant.js 解决 ESM 问题
 */

let requestInterceptorFn, requestErrorFn
let responseInterceptorFn, responseErrorFn

const mockAxiosInstance = {
  interceptors: {
    request: { use: jest.fn((ok, err) => { requestInterceptorFn = ok; requestErrorFn = err }) },
    response: { use: jest.fn((ok, err) => { responseInterceptorFn = ok; responseErrorFn = err }) }
  }
}

jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance)
}))

const mockStore = { state: { user: { token: '' } }, dispatch: jest.fn() }
jest.mock('@/store', () => mockStore)

const mockRouter = { push: jest.fn() }
jest.mock('@/router', () => mockRouter)

require('@/api/request')
const { Toast } = require('vant')

describe('Request 拦截器', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStore.state.user.token = ''
  })

  describe('请求拦截器', () => {
    it('有 token 时添加 Authorization 头', () => {
      mockStore.state.user.token = 'test-token'
      const config = { headers: {} }
      const result = requestInterceptorFn(config)
      expect(result.headers['Authorization']).toBe('Bearer test-token')
    })

    it('无 token 时不添加 Authorization 头', () => {
      const config = { headers: {} }
      const result = requestInterceptorFn(config)
      expect(result.headers['Authorization']).toBeUndefined()
    })

    it('请求错误时 reject', async () => {
      const error = new Error('请求错误')
      await expect(requestErrorFn(error)).rejects.toThrow('请求错误')
    })
  })

  describe('响应拦截器', () => {
    it('code 200 返回数据', () => {
      const response = { data: { code: 200, data: { id: 1 } } }
      const result = responseInterceptorFn(response)
      expect(result).toEqual({ code: 200, data: { id: 1 } })
    })

    it('code 非 200 显示错误提示', async () => {
      const response = { data: { code: 400, message: '参数错误' } }
      await expect(responseInterceptorFn(response)).rejects.toThrow('参数错误')
      expect(Toast.fail).toHaveBeenCalledWith('参数错误')
    })

    it('code 非 200 无 message 时显示默认提示', async () => {
      const response = { data: { code: 500 } }
      await expect(responseInterceptorFn(response)).rejects.toThrow()
      expect(Toast.fail).toHaveBeenCalledWith('请求失败')
    })

    it('code 401 触发登出并跳转登录页', async () => {
      const response = { data: { code: 401, message: '未授权' } }
      try { await responseInterceptorFn(response) } catch (e) { /* expected */ }
      expect(mockStore.dispatch).toHaveBeenCalledWith('user/logout')
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })

    it('网络错误显示提示', async () => {
      const error = new Error('Network Error')
      await expect(responseErrorFn(error)).rejects.toThrow('Network Error')
      expect(Toast.fail).toHaveBeenCalledWith('网络异常，请稍后重试')
    })
  })
})
