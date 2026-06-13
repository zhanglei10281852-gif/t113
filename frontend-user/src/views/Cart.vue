<template>
  <div class="cart-page">
    <van-nav-bar title="购物车" />

    <van-loading v-if="loading" class="cart-page__loading" size="36" vertical>加载中...</van-loading>

    <template v-else>
      <van-empty v-if="!items.length" description="购物车空空如也">
        <van-button round color="#1AAD19" @click="$router.push('/home')">去逛逛</van-button>
      </van-empty>

      <template v-else>
        <div class="cart-page__list">
          <van-swipe-cell v-for="item in items" :key="item.id" class="cart-page__swipe-cell">
            <div class="cart-page__item">
              <van-checkbox
                :value="item.checked"
                checked-color="#1AAD19"
                @click="toggleCheck(item)"
                class="cart-page__checkbox"
              />
              <van-image
                :src="item.image"
                width="90"
                height="90"
                fit="cover"
                radius="8"
                @click="$router.push(`/product/${item.productId}`)"
              />
              <div class="cart-page__item-info">
                <div class="cart-page__item-name ellipsis-2">{{ item.name }}</div>
                <div class="cart-page__item-spec">{{ item.spec }}</div>
                <div class="cart-page__item-bottom">
                  <span class="price">{{ item.price }}</span>
                  <van-stepper
                    :value="item.quantity"
                    :min="1"
                    :max="item.stock"
                    theme="round"
                    button-size="22"
                    @change="val => updateQty(item, val)"
                  />
                </div>
              </div>
            </div>
            <template #right>
              <van-button square type="danger" text="删除" class="cart-page__delete" @click="removeItem(item.id)" />
            </template>
          </van-swipe-cell>
        </div>

        <!-- 底部结算栏 -->
        <div class="cart-page__footer safe-bottom">
          <div class="cart-page__footer-left">
            <van-checkbox
              :value="isAllChecked"
              checked-color="#1AAD19"
              @click="toggleAll"
            >
              全选
            </van-checkbox>
          </div>
          <div class="cart-page__footer-right">
            <div class="cart-page__total">
              合计：<span class="price">{{ checkedTotal.toFixed(2) }}</span>
            </div>
            <van-button
              round
              color="#1AAD19"
              :disabled="!checkedCount"
              @click="handleCheckout"
            >
              结算({{ checkedCount }})
            </van-button>
          </div>
        </div>
      </template>
    </template>

    <div style="height: 120px;"></div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Toast, Dialog } from 'vant'

export default {
  name: 'Cart',
  computed: {
    ...mapState('cart', ['items', 'loading']),
    ...mapGetters('cart', ['checkedTotal', 'checkedCount', 'isAllChecked'])
  },
  created() {
    this.$store.dispatch('cart/fetchCart')
  },
  methods: {
    toggleCheck(item) {
      this.$store.dispatch('cart/updateItem', {
        id: item.id,
        data: { checked: !item.checked }
      })
    },
    updateQty(item, val) {
      this.$store.dispatch('cart/updateItem', {
        id: item.id,
        data: { quantity: val }
      })
    },
    removeItem(id) {
      Dialog.confirm({ title: '提示', message: '确定删除该商品吗？' })
        .then(() => {
          this.$store.dispatch('cart/removeItem', id)
          Toast.success('已删除')
        })
        .catch(() => {})
    },
    toggleAll() {
      this.$store.dispatch('cart/toggleCheckAll')
    },
    handleCheckout() {
      const checkedItems = this.items.filter(i => i.checked)
      this.$store.commit('checkout/SET_ITEMS', checkedItems)
      this.$router.push('/checkout')
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  background: $bg-page;

  &__loading {
    padding-top: 30%;
    text-align: center;
  }

  &__list {
    padding: $spacing-md;
  }

  &__swipe-cell {
    margin-bottom: $spacing-md;
    border-radius: $radius-md;
    overflow: hidden;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: $bg-card;
    border-radius: $radius-md;
    box-shadow: $shadow-card;
  }

  &__checkbox {
    flex-shrink: 0;
  }

  &__item-info {
    flex: 1;
    min-width: 0;
  }

  &__item-name {
    font-size: $font-md;
    line-height: 1.4;
    margin-bottom: $spacing-xs;
  }

  &__item-spec {
    font-size: $font-sm;
    color: $text-placeholder;
    margin-bottom: $spacing-sm;
  }

  &__item-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .price { font-size: $font-lg; }
  }

  &__delete {
    height: 100%;
  }

  &__footer {
    position: fixed;
    bottom: 50px;
    left: 0;
    right: 0;
    max-width: 750px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md $spacing-lg;
    background: $bg-card;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
    z-index: 100;

    &-right {
      display: flex;
      align-items: center;
      gap: $spacing-md;
    }
  }

  &__total {
    font-size: $font-md;
    .price { font-size: $font-xl; }
  }
}
</style>
