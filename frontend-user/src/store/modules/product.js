import { getBanners, getCategories, getRecommendProducts, getProducts, getProductDetail } from '@/api/product'

export default {
  namespaced: true,
  state: {
    banners: [],
    categories: [],
    recommendList: [],
    productList: [],
    currentProduct: null,
    loading: false
  },
  mutations: {
    SET_BANNERS(state, data) { state.banners = data },
    SET_CATEGORIES(state, data) { state.categories = data },
    SET_RECOMMEND(state, data) { state.recommendList = data },
    SET_PRODUCT_LIST(state, data) { state.productList = data },
    SET_CURRENT_PRODUCT(state, data) { state.currentProduct = data },
    SET_LOADING(state, val) { state.loading = val }
  },
  actions: {
    async fetchBanners({ commit }) {
      const res = await getBanners()
      commit('SET_BANNERS', res.data)
    },
    async fetchCategories({ commit }) {
      const res = await getCategories()
      commit('SET_CATEGORIES', res.data)
    },
    async fetchRecommend({ commit }) {
      const res = await getRecommendProducts()
      commit('SET_RECOMMEND', res.data)
    },
    async fetchProducts({ commit }, params) {
      commit('SET_LOADING', true)
      try {
        const res = await getProducts(params)
        commit('SET_PRODUCT_LIST', res.data.list)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchProductDetail({ commit }, id) {
      commit('SET_LOADING', true)
      try {
        const res = await getProductDetail(id)
        commit('SET_CURRENT_PRODUCT', res.data)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}
