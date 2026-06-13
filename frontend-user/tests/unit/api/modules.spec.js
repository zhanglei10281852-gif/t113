/**
 * API 模块测试
 * 验证各 API 函数正确调用 request
 */

const mockRequest = jest.fn()
jest.mock('@/api/request', () => mockRequest)

describe('API 模块', () => {
  beforeEach(() => {
    mockRequest.mockReset()
    mockRequest.mockResolvedValue({ code: 200, data: null })
  })

  describe('auth', () => {
    const { login, register } = require('@/api/auth')

    it('login 发送 POST /api/auth/login', async () => {
      await login({ username: 'demo', password: '123456' })
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/api/auth/login', method: 'post', data: { username: 'demo', password: '123456' }
      })
    })

    it('register 发送 POST /api/auth/register', async () => {
      await register({ username: 'new', password: '123', phone: '138' })
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/api/auth/register', method: 'post', data: { username: 'new', password: '123', phone: '138' }
      })
    })
  })

  describe('product', () => {
    const { getBanners, getCategories, getRecommendProducts, getProducts, getProductDetail } = require('@/api/product')

    it('getBanners GET /api/banners', async () => {
      await getBanners()
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/banners', method: 'get' })
    })

    it('getCategories GET /api/categories', async () => {
      await getCategories()
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/categories', method: 'get' })
    })

    it('getRecommendProducts GET /api/products/recommend', async () => {
      await getRecommendProducts()
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/products/recommend', method: 'get' })
    })

    it('getProducts 带参数', async () => {
      await getProducts({ categoryId: 1 })
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/products', method: 'get', params: { categoryId: 1 } })
    })

    it('getProductDetail 带 ID', async () => {
      await getProductDetail(101)
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/products/101', method: 'get' })
    })
  })

  describe('cart', () => {
    const { getCart, addToCart, updateCartItem, deleteCartItem, checkAll } = require('@/api/cart')

    it('getCart GET /api/cart', async () => {
      await getCart()
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/cart', method: 'get' })
    })

    it('addToCart POST /api/cart', async () => {
      await addToCart({ productId: 1 })
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/cart', method: 'post', data: { productId: 1 } })
    })

    it('updateCartItem PUT /api/cart/:id', async () => {
      await updateCartItem(1, { quantity: 3 })
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/cart/1', method: 'put', data: { quantity: 3 } })
    })

    it('deleteCartItem DELETE /api/cart/:id', async () => {
      await deleteCartItem(1)
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/cart/1', method: 'delete' })
    })

    it('checkAll PUT /api/cart/check-all', async () => {
      await checkAll(true)
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/cart/check-all', method: 'put', data: { checked: true } })
    })
  })

  describe('order', () => {
    const { createOrder, getOrders, cancelOrder, payOrder, confirmOrder } = require('@/api/order')

    it('createOrder POST /api/orders', async () => {
      await createOrder({ items: [] })
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/orders', method: 'post', data: { items: [] } })
    })

    it('getOrders GET /api/orders', async () => {
      await getOrders({ status: 0 })
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/orders', method: 'get', params: { status: 0 } })
    })

    it('cancelOrder PUT /api/orders/:id/cancel', async () => {
      await cancelOrder(1)
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/orders/1/cancel', method: 'put' })
    })

    it('payOrder PUT /api/orders/:id/pay', async () => {
      await payOrder(1)
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/orders/1/pay', method: 'put' })
    })

    it('confirmOrder PUT /api/orders/:id/confirm', async () => {
      await confirmOrder(1)
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/orders/1/confirm', method: 'put' })
    })
  })

  describe('address', () => {
    const { getAddresses, addAddress, updateAddress, deleteAddress } = require('@/api/address')

    it('getAddresses GET /api/addresses', async () => {
      await getAddresses()
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/addresses', method: 'get' })
    })

    it('addAddress POST /api/addresses', async () => {
      await addAddress({ name: '张三' })
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/addresses', method: 'post', data: { name: '张三' } })
    })

    it('updateAddress PUT /api/addresses/:id', async () => {
      await updateAddress(1, { name: '李四' })
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/addresses/1', method: 'put', data: { name: '李四' } })
    })

    it('deleteAddress DELETE /api/addresses/:id', async () => {
      await deleteAddress(1)
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/addresses/1', method: 'delete' })
    })
  })

  describe('favorite', () => {
    const { getFavorites, addFavorite, removeFavorite, checkFavorite } = require('@/api/favorite')

    it('getFavorites GET /api/favorites', async () => {
      await getFavorites()
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/favorites', method: 'get' })
    })

    it('addFavorite POST /api/favorites', async () => {
      await addFavorite({ productId: 1 })
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/favorites', method: 'post', data: { productId: 1 } })
    })

    it('removeFavorite DELETE /api/favorites/:id', async () => {
      await removeFavorite(1)
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/favorites/1', method: 'delete' })
    })

    it('checkFavorite GET /api/favorites/check/:id', async () => {
      await checkFavorite(1)
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/favorites/check/1', method: 'get' })
    })
  })

  describe('coupon', () => {
    const { getCoupons } = require('@/api/coupon')

    it('getCoupons GET /api/coupons', async () => {
      await getCoupons({ type: 'available' })
      expect(mockRequest).toHaveBeenCalledWith({ url: '/api/coupons', method: 'get', params: { type: 'available' } })
    })
  })
})
