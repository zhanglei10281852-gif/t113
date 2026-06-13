import Mock from 'mockjs'

let addresses = [
  {
    id: 1,
    name: '张三',
    phone: '13800001111',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '建国路88号SOHO现代城A座1201',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900002222',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detail: '张江高科技园区碧波路690号',
    isDefault: false
  }
]
let nextId = 3

// 获取地址列表
Mock.mock(/\/api\/addresses$/, 'get', () => {
  return { code: 200, message: 'success', data: addresses }
})

// 新增地址
Mock.mock(/\/api\/addresses$/, 'post', (options) => {
  const body = JSON.parse(options.body)
  if (body.isDefault) {
    addresses.forEach(a => { a.isDefault = false })
  }
  const addr = { id: nextId++, ...body }
  addresses.push(addr)
  return { code: 200, message: '添加成功', data: addr }
})

// 编辑地址
Mock.mock(/\/api\/addresses\/\d+$/, 'put', (options) => {
  const id = parseInt(options.url.match(/\/api\/addresses\/(\d+)/)[1])
  const body = JSON.parse(options.body)
  const idx = addresses.findIndex(a => a.id === id)
  if (idx > -1) {
    if (body.isDefault) {
      addresses.forEach(a => { a.isDefault = false })
    }
    addresses[idx] = { ...addresses[idx], ...body }
    return { code: 200, message: '修改成功', data: null }
  }
  return { code: 404, message: '地址不存在', data: null }
})

// 删除地址
Mock.mock(/\/api\/addresses\/\d+$/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\/api\/addresses\/(\d+)/)[1])
  addresses = addresses.filter(a => a.id !== id)
  return { code: 200, message: '已删除', data: null }
})
