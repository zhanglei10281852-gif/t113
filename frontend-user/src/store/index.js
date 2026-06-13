import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cart from './modules/cart'
import product from './modules/product'
import checkout from './modules/checkout'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    cart,
    product,
    checkout
  }
})
