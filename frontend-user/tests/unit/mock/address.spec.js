/**
 * Mock Address 模块测试
 */

const mockHandlers = []
jest.mock('mockjs', () => ({
  mock: jest.fn((pattern, method, handler) => {
    mockHandlers.push({ pattern: pattern.toString(), method, handler })
  })
}))

describe('Mock Address', () => {
  let getAddresses, addAddress, updateAddress, deleteAddress

  beforeAll(() => {
    require('@/mock/modules/address')
    getAddresses = mockHandlers.find(h => h.method === 'get').handler
    addAddress = mockHandlers.find(h => h.method === 'post').handler
    updateAddress = mockHandlers.find(h => h.method === 'put').handler
    deleteAddress = mockHandlers.find(h => h.method === 'delete').handler
  })

  it('获取地址列表返回默认数据', () => {
    const res = getAddresses()
    expect(res.code).toBe(200)
    expect(res.data.length).toBeGreaterThanOrEqual(2)
  })

  it('新增地址', () => {
    const before = getAddresses().data.length
    const res = addAddress({ body: JSON.stringify({ name: '王五', phone: '137', province: '浙江', city: '杭州', district: '西湖区', detail: '文三路', isDefault: false }) })
    expect(res.code).toBe(200)
    expect(getAddresses().data.length).toBe(before + 1)
  })

  it('新增默认地址会取消其他默认', () => {
    addAddress({ body: JSON.stringify({ name: '赵六', phone: '136', province: '江苏', city: '南京', district: '鼓楼区', detail: '中山路', isDefault: true }) })
    const defaults = getAddresses().data.filter(a => a.isDefault)
    expect(defaults).toHaveLength(1)
    expect(defaults[0].name).toBe('赵六')
  })

  it('编辑地址', () => {
    const res = updateAddress({ url: '/api/addresses/1', body: JSON.stringify({ name: '张三改', isDefault: false }) })
    expect(res.code).toBe(200)
    const addr = getAddresses().data.find(a => a.id === 1)
    expect(addr.name).toBe('张三改')
  })

  it('编辑不存在的地址返回 404', () => {
    const res = updateAddress({ url: '/api/addresses/9999', body: JSON.stringify({ name: 'X' }) })
    expect(res.code).toBe(404)
  })

  it('编辑地址设为默认会取消其他默认', () => {
    updateAddress({ url: '/api/addresses/1', body: JSON.stringify({ isDefault: true }) })
    const defaults = getAddresses().data.filter(a => a.isDefault)
    expect(defaults).toHaveLength(1)
  })

  it('删除地址', () => {
    const before = getAddresses().data.length
    deleteAddress({ url: '/api/addresses/1' })
    expect(getAddresses().data.length).toBe(before - 1)
  })
})
