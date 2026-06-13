<template>
  <div class="home">
    <!-- 顶部搜索栏 -->
    <div class="home__header">
      <div class="home__logo">鲜购</div>
      <van-search
        v-model="keyword"
        shape="round"
        placeholder="搜索商品"
        class="home__search"
        @search="onSearch"
        @focus="$router.push('/search')"
        readonly
      />
    </div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
      <!-- 骨架屏 -->
      <div v-if="!loaded" class="home__skeleton">
        <div class="home__skeleton-banner"></div>
        <div class="home__skeleton-cats">
          <div v-for="i in 4" :key="i" class="home__skeleton-cat"></div>
        </div>
        <div class="home__skeleton-title"></div>
        <div class="home__skeleton-grid">
          <div v-for="i in 4" :key="'p'+i" class="home__skeleton-card">
            <div class="home__skeleton-img"></div>
            <div class="home__skeleton-text"></div>
            <div class="home__skeleton-price"></div>
          </div>
        </div>
      </div>

      <template v-else>
      <!-- 轮播图 -->
      <div class="home__banner" v-if="banners.length">
        <van-swipe :autoplay="3000" indicator-color="#1AAD19" class="home__swipe">
          <van-swipe-item v-for="banner in banners" :key="banner.id">
            <van-image :src="banner.image" width="100%" height="150" fit="cover" lazy-load />
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- 分类入口 -->
      <div class="home__categories">
        <van-grid :column-num="4" :border="false" :gutter="0">
          <van-grid-item
            v-for="cat in categories.slice(0, 8)"
            :key="cat.id"
            :icon="cat.icon"
            :text="cat.name"
            icon-color="#1AAD19"
            @click="goCategory(cat.id)"
          />
        </van-grid>
      </div>

      <!-- 推荐商品 -->
      <div class="home__section">
        <div class="home__section-title">
          <span class="home__section-title-text">为你推荐</span>
          <span class="home__section-title-more" @click="$router.push('/category')">更多 ></span>
        </div>
        <div class="home__product-grid">
          <ProductCard
            v-for="item in recommendList"
            :key="item.id"
            :product="item"
          />
        </div>
      </div>
      </template>
    </van-pull-refresh>

    <!-- 底部占位 -->
    <div style="height: 60px;"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProductCard from '@/components/ProductCard.vue'

export default {
  name: 'Home',
  components: { ProductCard },
  data() {
    return {
      keyword: '',
      refreshing: false,
      loaded: false
    }
  },
  computed: {
    ...mapState('product', ['banners', 'categories', 'recommendList'])
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      await Promise.all([
        this.$store.dispatch('product/fetchBanners'),
        this.$store.dispatch('product/fetchCategories'),
        this.$store.dispatch('product/fetchRecommend')
      ])
      this.loaded = true
    },
    async onRefresh() {
      await this.loadData()
      this.refreshing = false
    },
    onSearch() {
      if (this.keyword.trim()) {
        this.$router.push({ path: '/search', query: { keyword: this.keyword } })
      }
    },
    goCategory(id) {
      this.$router.push({ path: '/category', query: { id } })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  background: $bg-page;

  &__header {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    padding: $spacing-sm $spacing-lg;
    background: linear-gradient(135deg, #1AAD19, #2ecc71);
  }

  &__logo {
    font-size: $font-xl;
    font-weight: 700;
    color: $text-white;
    margin-right: $spacing-sm;
    white-space: nowrap;
  }

  &__search {
    flex: 1;
    padding: 0;
    background: transparent;

    ::v-deep .van-search__content {
      background: rgba(255, 255, 255, 0.9);
    }
  }

  &__banner {
    padding: $spacing-md $spacing-lg 0;
  }

  &__swipe {
    border-radius: $radius-md;
    overflow: hidden;

    .van-image {
      display: block;
    }
  }

  &__categories {
    margin: $spacing-lg $spacing-lg 0;
    background: $bg-card;
    border-radius: $radius-md;
    padding: $spacing-md 0;
    box-shadow: $shadow-card;
  }

  &__section {
    padding: $spacing-lg;

    &-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-md;

      &-text {
        font-size: $font-lg;
        font-weight: 600;
        color: $text-primary;
        position: relative;
        padding-left: $spacing-md;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 2px;
          bottom: 2px;
          width: 3px;
          background: $color-primary;
          border-radius: 2px;
        }
      }

      &-more {
        font-size: $font-sm;
        color: $text-placeholder;
      }
    }
  }

  &__product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md;
  }

  // 骨架屏
  &__skeleton {
    padding: $spacing-md $spacing-lg;
    &-banner {
      height: 150px;
      border-radius: $radius-md;
      background: #eee;
      animation: skeleton-pulse 1.2s ease-in-out infinite;
    }
    &-cats {
      display: flex;
      justify-content: space-around;
      margin: $spacing-lg 0;
      padding: $spacing-lg 0;
      background: $bg-card;
      border-radius: $radius-md;
    }
    &-cat {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #eee;
      animation: skeleton-pulse 1.2s ease-in-out infinite;
    }
    &-title {
      width: 100px;
      height: 20px;
      border-radius: 4px;
      background: #eee;
      margin-bottom: $spacing-md;
      animation: skeleton-pulse 1.2s ease-in-out infinite;
    }
    &-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-md;
    }
    &-card {
      background: $bg-card;
      border-radius: $radius-md;
      padding: $spacing-sm;
      box-shadow: $shadow-card;
    }
    &-img {
      width: 100%;
      padding-top: 100%;
      border-radius: $radius-sm;
      background: #eee;
      animation: skeleton-pulse 1.2s ease-in-out infinite;
    }
    &-text {
      height: 14px;
      margin: $spacing-sm 0 $spacing-xs;
      border-radius: 4px;
      background: #eee;
      animation: skeleton-pulse 1.2s ease-in-out infinite;
    }
    &-price {
      width: 60px;
      height: 14px;
      border-radius: 4px;
      background: #eee;
      animation: skeleton-pulse 1.2s ease-in-out infinite;
    }
  }
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
