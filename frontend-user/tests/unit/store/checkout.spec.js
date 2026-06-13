import checkoutModule from '@/store/modules/checkout'

describe('Checkout Store', () => {
  let state

  beforeEach(() => {
    state = { items: [] }
  })

  describe('mutations', () => {
    it('SET_ITEMS 设置结算商品列表', () => {
      const items = [
        { productId: 1, name: '商品A', price: 100, quantity: 1 },
        { productId: 2, name: '商品B', price: 200, quantity: 2 }
      ]
      checkoutModule.mutations.SET_ITEMS(state, items)
      expect(state.items).toEqual(items)
      expect(state.items).toHaveLength(2)
    })

    it('SET_ITEMS 可以覆盖已有数据', () => {
      state.items = [{ productId: 99, name: '旧商品' }]
      const newItems = [{ productId: 1, name: '新商品' }]
      checkoutModule.mutations.SET_ITEMS(state, newItems)
      expect(state.items).toEqual(newItems)
    })

    it('SET_ITEMS 设置空数组', () => {
      state.items = [{ productId: 1 }]
      checkoutModule.mutations.SET_ITEMS(state, [])
      expect(state.items).toEqual([])
    })

    it('CLEAR 清空结算数据', () => {
      state.items = [
        { productId: 1, name: '商品A', price: 100, quantity: 1 }
      ]
      checkoutModule.mutations.CLEAR(state)
      expect(state.items).toEqual([])
    })

    it('CLEAR 对空列表也能正常执行', () => {
      checkoutModule.mutations.CLEAR(state)
      expect(state.items).toEqual([])
    })
  })
})
