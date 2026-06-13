<template>
  <div class="search-page">
    <div class="search-page__header">
      <van-search
        v-model="keyword"
        placeholder="搜索商品"
        shape="round"
        show-action
        autofocus
        @search="onSearch"
        @cancel="$router.back()"
      />
    </div>

    <!-- 搜索结果 -->
    <template v-if="searched">
      <van-loading v-if="loading" class="search-page__loading" />
      <van-empty v-else-if="!results.length" description="未找到相关商品" />
      <div v-else class="search-page__results">
        <div
          v-for="item in results"
          :key="item.id"
          class="search-page__item"
          @click="$router.push(`/product/${item.id}`)"
        >
          <van-image :src="item.image" width="100" height="100" fit="cover" lazy-load radius="4" />
          <div class="search-page__item-info">
            <div class="search-page__item-name ellipsis-2">{{ item.name }}</div>
            <div class="search-page__item-meta">
              <span class="price">{{ item.price }}</span>
              <span class="search-page__item-sales">{{ item.sales }}人付款</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 热门搜索 -->
    <div v-else class="search-page__hot">
      <div class="search-page__hot-title">热门搜索</div>
      <div class="search-page__hot-tags">
        <van-tag
          v-for="tag in hotKeywords"
          :key="tag"
          round
          size="medium"
          color="#f5f5f5"
          text-color="#666"
          class="search-page__hot-tag"
          @click="keyword = tag; onSearch()"
        >
          {{ tag }}
        </van-tag>
      </div>
    </div>
  </div>
</template>

<script>
import { getProducts } from '@/api/product'

export default {
  name: 'Search',
  data() {
    return {
      keyword: '',
      results: [],
      searched: false,
      loading: false,
      hotKeywords: ['iPhone', '华为', '笔记本', 'Nike', '护肤', '耳机', '冰箱', '书包']
    }
  },
  created() {
    const q = this.$route.query.keyword
    if (q) {
      this.keyword = q
      this.onSearch()
    }
  },
  methods: {
    async onSearch() {
      if (!this.keyword.trim()) return
      this.searched = true
      this.loading = true
      try {
        const res = await getProducts({ keyword: this.keyword, pageSize: 20 })
        this.results = res.data.list
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background: $bg-page;

  &__header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: $bg-card;
    box-shadow: $shadow-nav;
  }

  &__loading {
    padding-top: 30%;
    text-align: center;
  }

  &__results {
    padding: $spacing-md;
  }

  &__item {
    display: flex;
    gap: $spacing-md;
    background: $bg-card;
    border-radius: $radius-md;
    padding: $spacing-md;
    margin-bottom: $spacing-md;
    box-shadow: $shadow-card;
    cursor: pointer;

    &:active { transform: scale(0.98); }

    &-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
    }

    &-name {
      font-size: $font-md;
      line-height: 1.4;
    }

    &-meta {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    &-sales {
      font-size: $font-xs;
      color: $text-placeholder;
    }

    .price { font-size: $font-lg; }
  }

  &__hot {
    padding: $spacing-xl;

    &-title {
      font-size: $font-lg;
      font-weight: 600;
      margin-bottom: $spacing-lg;
    }

    &-tags {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-sm;
    }

    &-tag {
      cursor: pointer;
      padding: $spacing-xs $spacing-lg;
    }
  }
}
</style>
