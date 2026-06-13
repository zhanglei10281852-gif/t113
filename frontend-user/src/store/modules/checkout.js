export default {
  namespaced: true,
  state: {
    items: []
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    CLEAR(state) {
      state.items = []
    }
  }
}
