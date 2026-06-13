import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  checkAll,
} from "@/api/cart";

export default {
  namespaced: true,
  state: {
    items: [],
    loading: false,
  },
  getters: {
    totalCount: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    checkedItems: (state) => state.items.filter((item) => item.checked),
    checkedTotal: (_, getters) => {
      return getters.checkedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },
    checkedCount: (_, getters) => getters.checkedItems.length,
    isAllChecked: (state) =>
      state.items.length > 0 && state.items.every((item) => item.checked),
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items;
    },
    SET_LOADING(state, val) {
      state.loading = val;
    },
  },
  actions: {
    async fetchCart({ commit, rootGetters }) {
      if (!rootGetters["user/isLoggedIn"]) {
        commit("SET_ITEMS", []);
        return;
      }
      commit("SET_LOADING", true);
      try {
        const res = await getCart();
        commit("SET_ITEMS", res.data);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async addItem(_, payload) {
      return await addToCart(payload);
    },
    async updateItem({ dispatch }, { id, data }) {
      await updateCartItem(id, data);
      await dispatch("fetchCart");
    },
    async removeItem({ dispatch }, id) {
      await deleteCartItem(id);
      await dispatch("fetchCart");
    },
    async toggleCheckAll({ dispatch, getters }) {
      await checkAll(!getters.isAllChecked);
      await dispatch("fetchCart");
    },
  },
};
