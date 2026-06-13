import Mock from 'mockjs'
import './modules/auth'
import './modules/product'
import './modules/cart'
import './modules/order'
import './modules/address'
import './modules/favorite'
import './modules/coupon'

Mock.setup({
  timeout: '200-400'
})

console.log('[Mock] Mock 数据服务已启动')
