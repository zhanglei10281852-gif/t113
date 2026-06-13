import { login, register } from "@/api/auth";

const TOKEN_KEY = "ecommerce_token";
const USER_KEY = "ecommerce_user";

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem(TOKEN_KEY) || "",
    userInfo: JSON.parse(localStorage.getItem(USER_KEY) || "null"),
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo?.username || "",
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem(TOKEN_KEY, token);
    },
    SET_USER_INFO(state, info) {
      state.userInfo = info;
      localStorage.setItem(USER_KEY, JSON.stringify(info));
    },
    CLEAR_AUTH(state) {
      state.token = "";
      state.userInfo = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
  actions: {
    async login({ commit }, payload) {
      const res = await login(payload);
      commit("SET_TOKEN", res.data.token);
      commit("SET_USER_INFO", res.data.userInfo);
      return res;
    },
    async register(_, payload) {
      return await register(payload);
    },
    logout({ commit }) {
      commit("CLEAR_AUTH");
      commit("cart/SET_ITEMS", [], { root: true });
    },
  },
};
