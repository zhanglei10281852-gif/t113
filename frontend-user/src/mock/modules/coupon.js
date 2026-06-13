import Mock from 'mockjs'

const coupons = [
  { id: 1, name: '新人专享券', amount: 20, minSpend: 100, type: 'available', expireDate: '2026-06-30' },
  { id: 2, name: '满200减30', amount: 30, minSpend: 200, type: 'available', expireDate: '2026-05-31' },
  { id: 3, name: '满500减80', amount: 80, minSpend: 500, type: 'available', expireDate: '2026-04-30' },
  { id: 4, name: '全场通用券', amount: 10, minSpend: 50, type: 'used', expireDate: '2026-03-15' },
  { id: 5, name: '数码专享券', amount: 100, minSpend: 1000, type: 'expired', expireDate: '2025-12-31' }
]

Mock.mock(/\/api\/coupons/, 'get', (options) => {
  const url = new URL('http://localhost' + options.url)
  const type = url.searchParams.get('type')
  let list = [...coupons]
  if (type && type !== 'all') {
    list = list.filter(c => c.type === type)
  }
  return { code: 200, message: 'success', data: list }
})
