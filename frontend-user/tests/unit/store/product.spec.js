import productModule from '@/store/modules/product'

jest.mock('@/api/product', () => ({
  getBanners: jest.fn(),
  getCategories: jest.fn(),
  getRecommendProducts: jest.fn(),
  getProducts: jest.fn(),
  getProductDetail: jest.fn()
}))

const {
  getBanners,
  getCategories,
  getRecommendProducts,
  getProducts,
  getProductDetail
} = require('@/api/product')

const mockBanners = [
  { id: 1, image: 'banner1.jpg' },
  { id: 2, image: 'banner2.jpg' }
]

const mockCategories = [
  { id: 1, name: '手机数码', icon: 'phone-o' },
  { id: 2, name: '电脑办公', icon: 'desktop-o' }
]

const mockProducts = [
  { id: 101, name: 'iPhone 15', price: 8999, categoryId: 1 },
  { id: 102, name: 'MacBook Pro', price: 12999, categoryId: 2 }
]

const mockProductDetail = {
  id: 101,
  name: 'iPhone 15',
  price: 8999,
  images: ['img1.jpg', 'img2.jpg'],
  specs: [{ name: '颜色', values: ['黑色', '白色'] }]
}

describe('Product Store', () => {
  let state

  beforeEach(() => {
    state = {
      banners: [],
      categories: [],
      recommendList: [],
      productList: [],
      currentProduct: null,
      loading: false
    }
    jest.clearAllMocks()
  })

  // --- Mutations ---
  describe('mutations', () => {
    it('SET_BANNERS 设置轮播图', () => {
      productModule.mutations.SET_BANNERS(state, mockBanners)
      expect(state.banners).toEqual(mockBanners)
    })

    it('SET_CATEGORIES 设置分类列表', () => {
      productModule.mutations.SET_CATEGORIES(state, mockCategories)
      expect(state.categories).toEqual(mockCategories)
    })

    it('SET_RECOMMEND 设置推荐商品', () => {
      productModule.mutations.SET_RECOMMEND(state, mockProducts)
      expect(state.recommendList).toEqual(mockProducts)
    })

    it('SET_PRODUCT_LIST 设置商品列表', () => {
      productModule.mutations.SET_PRODUCT_LIST(state, mockProducts)
      expect(state.productList).toEqual(mockProducts)
    })

    it('SET_CURRENT_PRODUCT 设置当前商品详情', () => {
      productModule.mutations.SET_CURRENT_PRODUCT(state, mockProductDetail)
      expect(state.currentProduct).toEqual(mockProductDetail)
    })

    it('SET_CURRENT_PRODUCT 可设置为 null', () => {
      state.currentProduct = mockProductDetail
      productModule.mutations.SET_CURRENT_PRODUCT(state, null)
      expect(state.currentProduct).toBeNull()
    })

    it('SET_LOADING 设置加载状态', () => {
      productModule.mutations.SET_LOADING(state, true)
      expect(state.loading).toBe(true)
      productModule.mutations.SET_LOADING(state, false)
      expect(state.loading).toBe(false)
    })
  })

  // --- Actions ---
  describe('actions', () => {
    let commit

    beforeEach(() => {
      commit = jest.fn()
    })

    it('fetchBanners 获取轮播图并提交', async () => {
      getBanners.mockResolvedValue({ data: mockBanners })
      await productModule.actions.fetchBanners({ commit })
      expect(getBanners).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('SET_BANNERS', mockBanners)
    })

    it('fetchCategories 获取分类并提交', async () => {
      getCategories.mockResolvedValue({ data: mockCategories })
      await productModule.actions.fetchCategories({ commit })
      expect(getCategories).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('SET_CATEGORIES', mockCategories)
    })

    it('fetchRecommend 获取推荐商品并提交', async () => {
      getRecommendProducts.mockResolvedValue({ data: mockProducts })
      await productModule.actions.fetchRecommend({ commit })
      expect(getRecommendProducts).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('SET_RECOMMEND', mockProducts)
    })

    it('fetchProducts 获取商品列表，带 loading 状态', async () => {
      getProducts.mockResolvedValue({ data: { list: mockProducts, total: 2 } })
      const params = { categoryId: 1, pageSize: 10 }
      await productModule.actions.fetchProducts({ commit }, params)
      expect(commit).toHaveBeenCalledWith('SET_LOADING', true)
      expect(getProducts).toHaveBeenCalledWith(params)
      expect(commit).toHaveBeenCalledWith('SET_PRODUCT_LIST', mockProducts)
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })

    it('fetchProducts 请求失败时也会关闭 loading', async () => {
      getProducts.mockRejectedValue(new Error('网络错误'))
      try {
        await productModule.actions.fetchProducts({ commit }, {})
      } catch (e) { /* expected */ }
      expect(commit).toHaveBeenCalledWith('SET_LOADING', true)
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })

    it('fetchProductDetail 获取商品详情，带 loading 状态', async () => {
      getProductDetail.mockResolvedValue({ data: mockProductDetail })
      await productModule.actions.fetchProductDetail({ commit }, 101)
      expect(commit).toHaveBeenCalledWith('SET_LOADING', true)
      expect(getProductDetail).toHaveBeenCalledWith(101)
      expect(commit).toHaveBeenCalledWith('SET_CURRENT_PRODUCT', mockProductDetail)
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })

    it('fetchProductDetail 请求失败时也会关闭 loading', async () => {
      getProductDetail.mockRejectedValue(new Error('商品不存在'))
      try {
        await productModule.actions.fetchProductDetail({ commit }, 999)
      } catch (e) { /* expected */ }
      expect(commit).toHaveBeenCalledWith('SET_LOADING', true)
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })
  })
})
