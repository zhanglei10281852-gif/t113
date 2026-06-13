<template>
  <div class="favorites-page">
    <van-nav-bar title="我的收藏" left-arrow @click-left="$router.back()" />

    <div class="favorites-page__list">
      <van-loading v-if="loading" class="favorites-page__loading" />
      <van-empty v-else-if="!favorites.length" description="暂无收藏">
        <van-button round color="#1AAD19" @click="$router.push('/home')">去逛逛</van-button>
      </van-empty>
      <van-swipe-cell v-for="item in favorites" :key="item.id" class="favorites-page__cell">
        <div class="favorites-page__item" @click="$router.push(`/product/${item.productId}`)">
          <van-image :src="item.image" width="90" height="90" fit="cover" radius="4" />
          <div class="favorites-page__item-info">
            <div class="favorites-page__item-name ellipsis-2">{{ item.name }}</div>
            <div class="favorites-page__item-bottom">
              <span class="price">{{ item.price }}</span>
              <span class="favorites-page__item-time">{{ item.createTime }}</span>
            </div>
          </div>
        </div>
        <template #right>
          <van-button square type="danger" text="取消收藏" class="favorites-page__delete" @click="handleRemove(item.productId)" />
        </template>
      </van-swipe-cell>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { getFavorites, removeFavorite } from '@/api/favorite'

export default {
  name: 'Favorites',
  data() {
    return { favorites: [], loading: false }
  },
  created() {
    this.fetchFavorites()
  },
  methods: {
    async fetchFavorites() {
      this.loading = true
      try {
        const res = await getFavorites()
        this.favorites = res.data
      } finally {
        this.loading = false
      }
    },
    async handleRemove(productId) {
      await removeFavorite(productId)
      Toast.success('已取消收藏')
      this.fetchFavorites()
    }
  }
}
</script>

<style lang="scss" scoped>
.favorites-page {
  min-height: 100vh;
  background: $bg-page;

  &__list { padding: $spacing-md; }
  &__loading { padding-top: 20%; text-align: center; }
  &__cell { margin-bottom: $spacing-md; border-radius: $radius-md; overflow: hidden; }

  &__item {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: $bg-card;
    box-shadow: $shadow-card;
    border-radius: $radius-md;
    cursor: pointer;

    &-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; }
    &-name { font-size: $font-md; line-height: 1.4; }
    &-bottom { display: flex; justify-content: space-between; align-items: baseline; }
    &-time { font-size: $font-xs; color: $text-placeholder; }
    .price { font-size: $font-lg; }
  }

  &__delete { height: 100%; }
}
</style>
