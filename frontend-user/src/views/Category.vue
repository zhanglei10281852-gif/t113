<template>
  <div class="category-page">
    <van-nav-bar title="商品分类" />

    <div class="category-page__body">
      <!-- 左侧分类 -->
      <div class="category-page__sidebar">
        <div
          v-for="cat in categories"
          :key="cat.id"
          :class="['category-page__sidebar-item', { active: activeCat === cat.id }]"
          @click="selectCategory(cat.id)"
        >
          {{ cat.name }}
        </div>
      </div>

      <!-- 右侧商品列表 -->
      <div class="category-page__content">
        <van-loading v-if="categoryLoading" class="category-page__loading" />
        <van-empty v-else-if="!productList.length" description="暂无商品" />
        <div v-else class="category-page__grid">
          <div
            v-for="item in productList"
            :key="item.id"
            class="category-page__item"
            @click="$router.push(`/product/${item.id}`)"
          >
            <van-image :src="item.image" width="100" height="100" fit="cover" lazy-load radius="4" />
            <div class="category-page__item-info">
              <div class="category-page__item-name ellipsis-2">{{ item.name }}</div>
              <span class="price">{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Category',
  data() {
    return {
      activeCat: 1,
      categoryLoading: false
    }
  },
  computed: {
    ...mapState('product', ['categories', 'productList'])
  },
  created() {
    this.$store.dispatch('product/fetchCategories').then(() => {
      const queryId = this.$route.query.id
      if (queryId) this.activeCat = parseInt(queryId)
      this.selectCategory(this.activeCat)
    })
  },
  methods: {
    selectCategory(id) {
      this.activeCat = id
      this.categoryLoading = true
      this.$store.dispatch('product/fetchProducts', { categoryId: id, pageSize: 20 })
        .finally(() => { this.categoryLoading = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.category-page {
  height: 100vh;
  background: $bg-page;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  &__sidebar {
    width: 90px;
    background: $bg-card;
    overflow-y: auto;
    flex-shrink: 0;

    &-item {
      padding: $spacing-lg $spacing-sm;
      text-align: center;
      font-size: $font-md;
      color: $text-secondary;
      position: relative;
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        color: $color-primary;
        font-weight: 600;
        background: $bg-page;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 3px;
          background: $color-primary;
          border-radius: 0 2px 2px 0;
        }
      }
    }
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-md;
    padding-bottom: 60px;
  }

  &__loading {
    padding-top: 30%;
    text-align: center;
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__item {
    display: flex;
    gap: $spacing-md;
    background: $bg-card;
    border-radius: $radius-md;
    padding: $spacing-md;
    box-shadow: $shadow-card;
    cursor: pointer;
    transition: transform 0.2s;

    &:active {
      transform: scale(0.98);
    }

    &-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    &-name {
      font-size: $font-md;
      line-height: 1.4;
    }

    .price {
      font-size: $font-lg;
    }
  }
}
</style>
