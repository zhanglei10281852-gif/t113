import cartModule from '@/store/modules/cart'

// Mock API
jest.mock('@/api/cart', () => ({
  getCart: jest.fn(),
  addToCart: jest.fn(),
  updateCartItem: jest.fn(),
  deleteCartItem: jest.fn(),
  checkAll: jest.fn()
}))

const { getCart, addToCart, updateCartItem, deleteCartItem, checkAll } = require('@/api/cart')

const mockItems = [
  { id: 1, productId: 101, name: '商品A', price: 100, quantity: 2, checked: true },
  { id: 2, productId: 102, name: '商品B', price: 50, quantity: 1, checked: false },
  { id: 3, productId: 103, name: '商品C', price: 200, quantity: 3, checked: true }
]

describe('Cart Store', () => {
  let state

  beforeEach(() => {
    state = { items: JSON.parse(JSON.stringify(mockItems)), loading: false }
    jest.clearAllMocks()
  })

  // --- Getters ---
  describe('getters', () => {
    it('totalCount 计算所有商品数量之和', () => {
      expect(cartModule.getters.totalCount(state)).toBe(6) // 2+1+3
    })

    it('totalCount 空购物车返回 0', () => {
      state.items = []
      expect(cartModule.getters.totalCount(state)).toBe(0)
    })

    it('checkedItems 只返回已勾选商品', () => {
      const result = cartModule.getters.checkedItems(state)
      expect(result).toHaveLength(2)
      expect(result.every(i => i.checked)).toBe(true)
    })

    it('checkedTotal 计算已勾选商品总价', () => {
      const getters = { checkedItems: cartModule.getters.checkedItems(state) }
      // 100*2 + 200*3 = 800
      expect(cartModule.getters.checkedTotal(state, getters)).toBe(800)
    })

    it('checkedCount 返回已勾选商品数', () => {
      const getters = { checkedItems: cartModule.getters.checkedItems(state) }
      expect(cartModule.getters.checkedCount(state, getters)).toBe(2)
    })

    it('isAllChecked 全选时返回 true', () => {
      state.items.forEach(i => { i.checked = true })
      expect(cartModule.getters.isAllChecked(state)).toBe(true)
    })

    it('isAllChecked 部分选中返回 false', () => {
      expect(cartModule.getters.isAllChecked(state)).toBe(false)
    })

    it('isAllChecked 空购物车返回 false', () => {
      state.items = []
      expect(cartModule.getters.isAllChecked(state)).toBe(false)
    })
  })

  // --- Mutations ---
  describe('mutations', () => {
    it('SET_ITEMS 替换购物车列表', () => {
      const newItems = [{ id: 99, name: '新商品' }]
      cartModule.mutations.SET_ITEMS(state, newItems)
      expect(state.items).toEqual(newItems)
    })

    it('SET_LOADING 设置加载状态', () => {
      cartModule.mutations.SET_LOADING(state, true)
      expect(state.loading).toBe(true)
    })
  })

  // --- Actions ---
  describe('actions', () => {
    let commit, dispatch, rootGetters

    beforeEach(() => {
      commit = jest.fn()
      dispatch = jest.fn()
      rootGetters = { 'user/isLoggedIn': true }
    })

    it('fetchCart 未登录时清空购物车，不请求 API', async () => {
      rootGetters['user/isLoggedIn'] = false
      await cartModule.actions.fetchCart({ commit, rootGetters })
      expect(commit).toHaveBeenCalledWith('SET_ITEMS', [])
      expect(getCart).not.toHaveBeenCalled()
    })

    it('fetchCart 已登录时请求 API 并设置数据', async () => {
      getCart.mockResolvedValue({ data: mockItems })
      await cartModule.actions.fetchCart({ commit, rootGetters })
      expect(commit).toHaveBeenCalledWith('SET_LOADING', true)
      expect(commit).toHaveBeenCalledWith('SET_ITEMS', mockItems)
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })

    it('fetchCart 请求失败时也会关闭 loading', async () => {
      getCart.mockRejectedValue(new Error('网络错误'))
      try {
        await cartModule.actions.fetchCart({ commit, rootGetters })
      } catch (e) { /* expected */ }
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })

    it('addItem 调用 addToCart API', async () => {
      const payload = { productId: 1, name: 'test' }
      addToCart.mockResolvedValue({ code: 200 })
      await cartModule.actions.addItem({}, payload)
      expect(addToCart).toHaveBeenCalledWith(payload)
    })

    it('removeItem 删除后重新拉取购物车', async () => {
      deleteCartItem.mockResolvedValue({ code: 200 })
      await cartModule.actions.removeItem({ dispatch }, 1)
      expect(deleteCartItem).toHaveBeenCalledWith(1)
      expect(dispatch).toHaveBeenCalledWith('fetchCart')
    })

    it('updateItem 更新后重新拉取购物车', async () => {
      updateCartItem.mockResolvedValue({ code: 200 })
      await cartModule.actions.updateItem({ dispatch }, { id: 1, data: { quantity: 5 } })
      expect(updateCartItem).toHaveBeenCalledWith(1, { quantity: 5 })
      expect(dispatch).toHaveBeenCalledWith('fetchCart')
    })

    it('toggleCheckAll 调用全选 API 后刷新', async () => {
      const getters = { isAllChecked: false }
      checkAll.mockResolvedValue({ code: 200 })
      await cartModule.actions.toggleCheckAll({ dispatch, getters })
      expect(checkAll).toHaveBeenCalledWith(true)
      expect(dispatch).toHaveBeenCalledWith('fetchCart')
    })
  })
})
