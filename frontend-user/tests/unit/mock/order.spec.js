/**
 * Mock Order 模块测试
 */

const mockHandlers = []
jest.mock('mockjs', () => ({
  mock: jest.fn((pattern, method, handler) => {
    mockHandlers.push({ pattern: pattern.toString(), method, handler })
  }),
  Mock: { mock: jest.fn(tpl => '999') }
}))

describe('Mock Order', () => {
  let createOrder, getOrders, cancelOrder, payOrder, confirmOrder

  beforeAll(() => {
    require('@/mock/modules/order')
    createOrder = mockHandlers.find(h => h.method === 'post' && h.pattern.includes('orders$')).handler
    getOrders = mockHandlers.find(h => h.method === 'get').handler
    cancelOrder = mockHandlers.find(h => h.pattern.includes('cancel')).handler
    payOrder = mockHandlers.find(h => h.pattern.includes('pay')).handler
    confirmOrder = mockHandlers.find(h => h.pattern.includes('confirm')).handler
  })

  it('获取订单列表 - 全部', () => {
    const res = getOrders({ url: '/api/orders' })
    expect(res.code).toBe(200)
    expect(res.data.length).toBeGreaterThanOrEqual(3)
  })

  it('获取订单列表 - 按状态筛选', () => {
    const res = getOrders({ url: '/api/orders?status=2' })
    expect(res.code).toBe(200)
    res.data.forEach(o => expect(o.status).toBe(2))
  })

  it('获取订单列表 - status=-1 返回全部', () => {
    const all = getOrders({ url: '/api/orders' })
    const filtered = getOrders({ url: '/api/orders?status=-1' })
    expect(filtered.data.length).toBe(all.data.length)
  })

  it('创建订单', () => {
    const before = getOrders({ url: '/api/orders' }).data.length
    const res = createOrder({
      body: JSON.stringify({
        items: [{ productId: 1, name: 'Test', price: 100, quantity: 1 }],
        totalAmount: 100,
        address: { name: '张三' }
      })
    })
    expect(res.code).toBe(200)
    expect(res.data.status).toBe(0) // 待付款
    expect(res.data.orderNo).toBeDefined()
    const after = getOrders({ url: '/api/orders' }).data.length
    expect(after).toBe(before + 1)
  })

  it('取消待付款订单', () => {
    // 刚创建的订单是待付款
    const orders = getOrders({ url: '/api/orders?status=0' }).data
    const order = orders[0]
    const res = cancelOrder({ url: `/api/orders/${order.id}/cancel` })
    expect(res.code).toBe(200)
  })

  it('取消非待付款订单失败', () => {
    // 待收货订单不能取消
    const orders = getOrders({ url: '/api/orders?status=2' }).data
    if (orders.length > 0) {
      const res = cancelOrder({ url: `/api/orders/${orders[0].id}/cancel` })
      expect(res.code).toBe(400)
    }
  })

  it('支付订单', () => {
    // 先创建一个新订单
    const createRes = createOrder({
      body: JSON.stringify({ items: [{ name: 'X', price: 50, quantity: 1 }], totalAmount: 50, address: {} })
    })
    const res = payOrder({ url: `/api/orders/${createRes.data.id}/pay` })
    expect(res.code).toBe(200)
  })

  it('支付非待付款订单失败', () => {
    const orders = getOrders({ url: '/api/orders?status=2' }).data
    if (orders.length > 0) {
      const res = payOrder({ url: `/api/orders/${orders[0].id}/pay` })
      expect(res.code).toBe(400)
    }
  })

  it('确认收货', () => {
    const orders = getOrders({ url: '/api/orders?status=2' }).data
    if (orders.length > 0) {
      const res = confirmOrder({ url: `/api/orders/${orders[0].id}/confirm` })
      expect(res.code).toBe(200)
    }
  })

  it('确认非待收货订单失败', () => {
    const orders = getOrders({ url: '/api/orders?status=3' }).data
    if (orders.length > 0) {
      const res = confirmOrder({ url: `/api/orders/${orders[0].id}/confirm` })
      expect(res.code).toBe(400)
    }
  })
})
