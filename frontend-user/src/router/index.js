import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', hideTabbar: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册', hideTabbar: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '鲜购' }
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('@/views/Category.vue'),
    meta: { title: '分类' }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/Cart.vue'),
    meta: { title: '购物车', requireAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { title: '我的', requireAuth: true }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetail.vue'),
    meta: { title: '商品详情', hideTabbar: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue'),
    meta: { title: '搜索', hideTabbar: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/Checkout.vue'),
    meta: { title: '确认订单', hideTabbar: true, requireAuth: true }
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('@/views/Payment.vue'),
    meta: { title: '收银台', hideTabbar: true, requireAuth: true }
  },
  {
    path: '/pay-result',
    name: 'PayResult',
    component: () => import('@/views/PayResult.vue'),
    meta: { title: '支付结果', hideTabbar: true, requireAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/Orders.vue'),
    meta: { title: '我的订单', hideTabbar: true, requireAuth: true }
  },
  {
    path: '/address',
    name: 'Address',
    component: () => import('@/views/Address.vue'),
    meta: { title: '收货地址', hideTabbar: true, requireAuth: true }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('@/views/Favorites.vue'),
    meta: { title: '我的收藏', hideTabbar: true, requireAuth: true }
  },
  {
    path: '/coupons',
    name: 'Coupons',
    component: () => import('@/views/Coupons.vue'),
    meta: { title: '优惠券', hideTabbar: true, requireAuth: true }
  }
]

const router = new VueRouter({
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '鲜购'
  if (to.meta.requireAuth && !store.getters['user/isLoggedIn']) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
