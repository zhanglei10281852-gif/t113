<template>
  <van-tabbar v-model="active" active-color="#1AAD19" inactive-color="#999" class="app-tabbar safe-bottom">
    <van-tabbar-item name="home" icon="home-o" to="/home">首页</van-tabbar-item>
    <van-tabbar-item name="category" icon="apps-o" to="/category">分类</van-tabbar-item>
    <van-tabbar-item name="cart" icon="shopping-cart-o" to="/cart" :badge="cartCount || ''">购物车</van-tabbar-item>
    <van-tabbar-item name="profile" icon="user-o" to="/profile">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  name: 'TabBar',
  data() {
    return { active: 'home' }
  },
  computed: {
    cartCount() {
      return this.$store.getters['cart/totalCount']
    }
  },
  watch: {
    '$route.name': {
      immediate: true,
      handler(name) {
        const map = { Home: 'home', Category: 'category', Cart: 'cart', Profile: 'profile' }
        if (map[name]) this.active = map[name]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-tabbar {
  box-shadow: $shadow-nav;
}
</style>
