<template>
  <div class="detail-page">
    <van-nav-bar
      title="商品详情"
      left-arrow
      @click-left="$router.back()"
      fixed
      placeholder
    />

    <template v-if="product">
      <!-- 商品图片轮播 -->
      <van-swipe :autoplay="4000" indicator-color="#1AAD19" class="detail-page__swipe">
        <van-swipe-item v-for="(img, idx) in product.images" :key="idx">
          <van-image :src="img" width="100%" height="375" fit="cover" />
        </van-swipe-item>
      </van-swipe>

      <!-- 价格信息 -->
      <div class="detail-page__price-card">
        <div class="detail-page__price-row">
          <span class="price detail-page__current-price">{{ product.price }}</span>
          <span class="detail-page__original-price">¥{{ product.originalPrice }}</span>
        </div>
        <div class="detail-page__name">{{ product.name }}</div>
        <div class="detail-page__meta">
          <van-tag plain type="primary" color="#1AAD19">{{ product.category }}</van-tag>
          <span class="detail-page__meta-item">销量 {{ product.sales }}</span>
          <span class="detail-page__meta-item">评分 {{ product.rating }}</span>
        </div>
      </div>

      <!-- 规格选择 -->
      <div class="detail-page__section" v-if="product.specs">
        <van-cell title="已选" :value="selectedSpec" is-link @click="showSpecPopup = true" />
      </div>

      <!-- 商品详情 -->
      <div class="detail-page__section">
        <div class="detail-page__section-title">商品详情</div>
        <div class="detail-page__desc">{{ product.description }}</div>
        <div class="detail-page__detail-images">
          <van-image
            v-for="(img, idx) in product.images"
            :key="'d' + idx"
            :src="img"
            width="100%"
            fit="cover"
            lazy-load
            class="detail-page__detail-img"
          />
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="detail-page__footer safe-bottom">
        <div class="detail-page__footer-icons">
          <div class="detail-page__footer-icon" @click="$router.push('/home')">
            <van-icon name="home-o" size="22" />
            <span>首页</span>
          </div>
          <div class="detail-page__footer-icon" @click="toggleFavorite">
            <van-icon :name="isFavorited ? 'like' : 'like-o'" size="22" :color="isFavorited ? '#ee0a24' : ''" />
            <span>收藏</span>
          </div>
          <div class="detail-page__footer-icon" @click="$router.push('/cart')">
            <van-badge :content="cartCount || ''" :max="99">
              <van-icon name="shopping-cart-o" size="22" />
            </van-badge>
            <span>购物车</span>
          </div>
        </div>
        <div class="detail-page__footer-btns">
          <van-button round color="#FF6B35" @click="handleAddCart" :loading="addingCart">
            加入购物车
          </van-button>
          <van-button round color="#1AAD19" @click="handleBuyNow">
            立即购买
          </van-button>
        </div>
      </div>

      <!-- 规格弹窗 -->
      <van-popup v-model="showSpecPopup" position="bottom" round class="detail-page__spec-popup">
        <div class="detail-page__spec-content">
          <div class="detail-page__spec-header">
            <van-image :src="product.image" width="80" height="80" fit="cover" radius="8" />
            <div class="detail-page__spec-info">
              <span class="price">{{ product.price }}</span>
              <span class="detail-page__spec-stock">库存 {{ product.stock }} 件</span>
            </div>
            <van-icon name="cross" size="20" @click="showSpecPopup = false" class="detail-page__spec-close" />
          </div>
          <div v-for="spec in product.specs" :key="spec.name" class="detail-page__spec-group">
            <div class="detail-page__spec-label">{{ spec.name }}</div>
            <div class="detail-page__spec-values">
              <van-tag
                v-for="val in spec.values"
                :key="val"
                :plain="!isSpecSelected(spec.name, val)"
                :color="isSpecSelected(spec.name, val) ? '#1AAD19' : '#eee'"
                :text-color="isSpecSelected(spec.name, val) ? '#fff' : '#333'"
                size="large"
                round
                class="detail-page__spec-tag"
                @click="selectSpec(spec.name, val)"
              >
                {{ val }}
              </van-tag>
            </div>
          </div>
          <van-button block round color="#1AAD19" @click="confirmSpec" class="detail-page__spec-confirm">
            确定
          </van-button>
        </div>
      </van-popup>
    </template>

    <van-loading v-else class="detail-page__loading" size="36" vertical>加载中...</van-loading>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { addFavorite, removeFavorite, checkFavorite } from '@/api/favorite'

export default {
  name: 'ProductDetail',
  data() {
    return {
      showSpecPopup: false,
      specSelection: {},
      addingCart: false,
      isFavorited: false,
      pendingAction: null
    }
  },
  computed: {
    product() {
      return this.$store.state.product.currentProduct
    },
    cartCount() {
      return this.$store.getters['cart/totalCount']
    },
    selectedSpec() {
      const vals = Object.values(this.specSelection)
      return vals.length ? vals.join(' / ') : '请选择规格'
    }
  },
  created() {
    // 先清空旧数据，避免闪现上一个商品
    this.$store.commit('product/SET_CURRENT_PRODUCT', null)
    const id = this.$route.params.id
    this.$store.dispatch('product/fetchProductDetail', id)
    this.$store.dispatch('cart/fetchCart')
    this.checkFav(id)
  },
  methods: {
    async checkFav(id) {
      if (!this.$store.getters['user/isLoggedIn']) return
      try {
        const res = await checkFavorite(id)
        this.isFavorited = res.data
      } catch (e) { /* ignore */ }
    },
    async toggleFavorite() {
      if (!this.$store.getters['user/isLoggedIn']) {
        this.$router.push({ path: '/login', query: { redirect: this.$route.fullPath } })
        return
      }
      if (this.isFavorited) {
        await removeFavorite(this.product.id)
        this.isFavorited = false
        Toast.success('已取消收藏')
      } else {
        await addFavorite({
          productId: this.product.id,
          name: this.product.name,
          image: this.product.image,
          price: this.product.price
        })
        this.isFavorited = true
        Toast.success('收藏成功')
      }
    },
    isSpecSelected(name, val) {
      return this.specSelection[name] === val
    },
    selectSpec(name, val) {
      this.$set(this.specSelection, name, val)
    },
    async handleAddCart() {
      if (!this.$store.getters['user/isLoggedIn']) {
        this.$router.push({ path: '/login', query: { redirect: this.$route.fullPath } })
        return
      }
      // 未选规格时先弹出规格弹窗
      if (Object.keys(this.specSelection).length < (this.product.specs || []).length) {
        this.pendingAction = 'cart'
        this.showSpecPopup = true
        return
      }
      this.doAddCart()
    },
    async doAddCart() {
      this.addingCart = true
      try {
        await this.$store.dispatch('cart/addItem', {
          productId: this.product.id,
          name: this.product.name,
          image: this.product.image,
          price: this.product.price,
          spec: this.selectedSpec,
          stock: this.product.stock
        })
        Toast.success('已加入购物车')
        this.$store.dispatch('cart/fetchCart')
      } finally {
        this.addingCart = false
      }
    },
    handleBuyNow() {
      if (!this.$store.getters['user/isLoggedIn']) {
        this.$router.push({ path: '/login', query: { redirect: this.$route.fullPath } })
        return
      }
      if (Object.keys(this.specSelection).length < (this.product.specs || []).length) {
        this.pendingAction = 'buy'
        this.showSpecPopup = true
        return
      }
      this.doBuyNow()
    },
    doBuyNow() {
      this.$store.commit('checkout/SET_ITEMS', [{
        productId: this.product.id,
        name: this.product.name,
        image: this.product.image,
        price: this.product.price,
        quantity: 1,
        spec: this.selectedSpec
      }])
      this.$router.push('/checkout')
    },
    confirmSpec() {
      if (Object.keys(this.specSelection).length < (this.product.specs || []).length) {
        Toast('请选择完整规格')
        return
      }
      this.showSpecPopup = false
      if (this.pendingAction === 'cart') {
        this.doAddCart()
      } else if (this.pendingAction === 'buy') {
        this.doBuyNow()
      }
      this.pendingAction = null
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: $bg-page;
  padding-bottom: 70px;

  &__swipe {
    .van-image { display: block; }
  }

  &__price-card {
    background: $bg-card;
    padding: $spacing-lg;
    margin-bottom: $spacing-sm;
  }

  &__price-row {
    display: flex;
    align-items: baseline;
    gap: $spacing-sm;
  }

  &__current-price {
    font-size: 24px;
  }

  &__original-price {
    font-size: $font-sm;
    color: $text-placeholder;
    text-decoration: line-through;
  }

  &__name {
    font-size: $font-lg;
    font-weight: 600;
    margin: $spacing-md 0 $spacing-sm;
    line-height: 1.5;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    &-item {
      font-size: $font-sm;
      color: $text-placeholder;
    }
  }

  &__section {
    background: $bg-card;
    margin-bottom: $spacing-sm;
    padding: $spacing-lg;

    &-title {
      font-size: $font-lg;
      font-weight: 600;
      margin-bottom: $spacing-md;
      padding-left: $spacing-md;
      border-left: 3px solid $color-primary;
    }
  }

  &__desc {
    font-size: $font-md;
    color: $text-secondary;
    line-height: 1.8;
    margin-bottom: $spacing-lg;
  }

  &__detail-img {
    margin-bottom: $spacing-sm;
    border-radius: $radius-sm;
    overflow: hidden;
  }

  &__footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 750px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-sm $spacing-lg;
    background: $bg-card;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
    z-index: 100;

    &-icons {
      display: flex;
      gap: $spacing-xl;
    }

    &-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: $font-xs;
      color: $text-secondary;
      cursor: pointer;

      span { margin-top: 2px; }
    }

    &-btns {
      display: flex;
      gap: $spacing-sm;

      .van-button {
        min-width: 110px;
        height: 40px;
        font-size: 14px;
      }
    }
  }

  &__loading {
    padding-top: 40%;
  }

  &__spec-popup {
    max-height: 70vh;
  }

  &__spec-content {
    padding: $spacing-xl;
  }

  &__spec-header {
    display: flex;
    gap: $spacing-lg;
    margin-bottom: $spacing-xl;
    position: relative;
  }

  &__spec-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: $spacing-xs;

    .price { font-size: 20px; }
  }

  &__spec-stock {
    font-size: $font-sm;
    color: $text-placeholder;
  }

  &__spec-close {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    color: $text-placeholder;
  }

  &__spec-group {
    margin-bottom: $spacing-lg;
  }

  &__spec-label {
    font-size: $font-md;
    font-weight: 600;
    margin-bottom: $spacing-sm;
  }

  &__spec-values {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }

  &__spec-tag {
    cursor: pointer;
    padding: $spacing-xs $spacing-lg;
  }

  &__spec-confirm {
    margin-top: $spacing-xl;
  }
}
</style>
