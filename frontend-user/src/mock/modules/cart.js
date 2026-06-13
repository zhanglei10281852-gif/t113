import Mock from 'mockjs'

// 模拟购物车数据
let cartItems = [
  {
    id: 1,
    productId: 101,
    name: 'iPhone 15 Pro Max',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=200&fit=crop',
    price: 8999,
    quantity: 1,
    checked: true,
    spec: '黑色 / 标准版',
    stock: 99
  },
  {
    id: 2,
    productId: 401,
    name: 'Nike Air Max 270',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
    price: 899,
    quantity: 2,
    checked: true,
    spec: '白色 / 42码',
    stock: 50
  }
]

let nextId = 3

// 获取购物车
Mock.mock(/\/api\/cart$/, 'get', () => {
  return { code: 200, message: 'success', data: cartItems }
})

// 添加到购物车
Mock.mock(/\/api\/cart$/, 'post', (options) => {
  const body = JSON.parse(options.body)
  const existing = cartItems.find(item => item.productId === body.productId && item.spec === body.spec)
  if (existing) {
    existing.quantity += (body.quantity || 1)
  } else {
    cartItems.push({
      id: nextId++,
      productId: body.productId,
      name: body.name,
      image: body.image,
      price: body.price,
      quantity: body.quantity || 1,
      checked: true,
      spec: body.spec || '默认',
      stock: body.stock || 99
    })
  }
  return { code: 200, message: '已加入购物车', data: null }
})

// 更新购物车项（数量/选中状态）
Mock.mock(/\/api\/cart\/\d+/, 'put', (options) => {
  const id = parseInt(options.url.match(/\/api\/cart\/(\d+)/)[1])
  const body = JSON.parse(options.body)
  const item = cartItems.find(i => i.id === id)
  if (item) {
    if (body.quantity !== undefined) item.quantity = body.quantity
    if (body.checked !== undefined) item.checked = body.checked
    return { code: 200, message: 'success', data: null }
  }
  return { code: 404, message: '购物车项不存在', data: null }
})

// 删除购物车项
Mock.mock(/\/api\/cart\/\d+/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\/api\/cart\/(\d+)/)[1])
  cartItems = cartItems.filter(i => i.id !== id)
  return { code: 200, message: '已删除', data: null }
})

// 全选/取消全选
Mock.mock(/\/api\/cart\/check-all/, 'put', (options) => {
  const { checked } = JSON.parse(options.body)
  cartItems.forEach(item => { item.checked = checked })
  return { code: 200, message: 'success', data: null }
})
