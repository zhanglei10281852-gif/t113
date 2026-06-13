import Mock from 'mockjs'

let favorites = []

// 获取收藏列表
Mock.mock(/\/api\/favorites$/, 'get', () => {
  return { code: 200, message: 'success', data: favorites }
})

// 添加收藏
Mock.mock(/\/api\/favorites$/, 'post', (options) => {
  const body = JSON.parse(options.body)
  if (favorites.find(f => f.productId === body.productId)) {
    return { code: 400, message: '已收藏', data: null }
  }
  favorites.push({
    id: favorites.length + 1,
    productId: body.productId,
    name: body.name,
    image: body.image,
    price: body.price,
    createTime: new Date().toLocaleString('zh-CN')
  })
  return { code: 200, message: '收藏成功', data: null }
})

// 取消收藏
Mock.mock(/\/api\/favorites\/\d+/, 'delete', (options) => {
  const productId = parseInt(options.url.match(/\/api\/favorites\/(\d+)/)[1])
  favorites = favorites.filter(f => f.productId !== productId)
  return { code: 200, message: '已取消收藏', data: null }
})

// 检查是否已收藏
Mock.mock(/\/api\/favorites\/check\/\d+/, 'get', (options) => {
  const productId = parseInt(options.url.match(/\/api\/favorites\/check\/(\d+)/)[1])
  const isFav = favorites.some(f => f.productId === productId)
  return { code: 200, message: 'success', data: isFav }
})
