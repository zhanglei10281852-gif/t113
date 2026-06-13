<template>
  <div id="app">
    <keep-alive :include="['Home', 'Category', 'Cart', 'Profile']">
      <router-view />
    </keep-alive>
    <TabBar v-if="showTabbar" />
  </div>
</template>

<script>
import TabBar from '@/components/TabBar.vue'

export default {
  name: 'App',
  components: { TabBar },
  computed: {
    showTabbar() {
      return !this.$route.meta.hideTabbar
    }
  }
}
</script>

<style lang="scss">
</style>
