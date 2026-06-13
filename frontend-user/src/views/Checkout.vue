<template>
  <div class="checkout-page">
    <van-nav-bar title="确认订单" left-arrow @click-left="$router.back()" />

    <!-- 收货地址 -->
    <div class="checkout-page__address" @click="$router.push('/address')">
      <template v-if="defaultAddress">
        <div class="checkout-page__address-info">
          <div class="checkout-page__address-user">
            <span>{{ defaultAddress.name }}</span>
            <span>{{ defaultAddress.phone }}</span>
          </div>
          <div class="checkout-page__address-detail">
            {{ defaultAddress.province }} {{ defaultAddress.city }} {{ defaultAddress.district }} {{ defaultAddress.detail }}
          </div>
        </div>
        <van-icon name="arrow" />
      </template>
      <template v-else>
        <van-icon name="add-o" color="#1AAD19" />
        <span class="checkout-page__address-add">添加收货地址</span>
        <van-icon name="arrow" />
      </template>
    </div>

    <!-- 商品列表 -->
    <div class="checkout-page__goods">
      <div class="checkout-page__goods-title">商品信息</div>
      <div v-for="(item, index) in orderItems" :key="index" class="checkout-page__goods-item">
        <van-image :src="item.image" width="70" height="70" fit="cover" radius="4" />
        <div class="checkout-page__goods-info">
          <div class="checkout-page__goods-name ellipsis">{{ item.name }}</div>
          <div class="checkout-page__goods-spec">{{ item.spec }}</div>
          <div class="checkout-page__goods-bottom">
            <span class="price">{{ item.price }}</span>
            <span>x{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 金额明细 -->
    <div class="checkout-page__summary">
      <van-cell title="商品金额" :value="'¥' + goodsAmount.toFixed(2)" />
      <van-cell title="运费" value="免运费" />
      <van-cell title="优惠券" is-link @click="showCouponPopup = true"
        :value="selectedCoupon ? '-¥' + selectedCoupon.amount + '.00' : '选择优惠券'" />
    </div>

    <!-- 优惠券选择弹窗 -->
    <van-popup v-model="showCouponPopup" position="bottom" round class="checkout-page__coupon-popup">
      <div class="checkout-page__coupon-header">
        <span>选择优惠券</span>
        <van-icon name="cross" @click="showCouponPopup = false" />
      </div>
      <div class="checkout-page__coupon-list">
        <van-empty v-if="!availableCoupons.length" description="暂无可用优惠券" />
        <div v-for="c in availableCoupons" :key="c.id"
          :class="['checkout-page__coupon-item', { active: selectedCoupon && selectedCoupon.id === c.id, disabled: goodsAmount < c.minSpend }]"
          @click="pickCoupon(c)">
          <div class="checkout-page__coupon-item-left">
            <span class="symbol">¥</span><span class="amount">{{ c.amount }}</span>
          </div>
          <div class="checkout-page__coupon-item-right">
            <div class="name">{{ c.name }}</div>
            <div class="condition">满{{ c.minSpend }}元可用</div>
            <div class="expire">有效期至 {{ c.expireDate }}</div>
          </div>
          <van-icon v-if="selectedCoupon && selectedCoupon.id === c.id" name="success" color="#1AAD19" size="20" />
        </div>
      </div>
      <div class="checkout-page__coupon-actions">
        <van-button plain round size="small" @click="selectedCoupon = null; showCouponPopup = false">不使用优惠券</van-button>
      </div>
    </van-popup>

    <!-- 底部提交 -->
    <div class="checkout-page__footer safe-bottom">
      <div class="checkout-page__total">
        合计：<span class="price">{{ totalAmount.toFixed(2) }}</span>
        <span v-if="discountAmount > 0" class="checkout-page__saved">已优惠¥{{ discountAmount.toFixed(2) }}</span>
      </div>
      <van-button round color="#1AAD19" :loading="submitting" @click="submitOrder">
        提交订单
      </van-button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { getAddresses } from '@/api/address'
import { createOrder } from '@/api/order'
import { getCoupons } from '@/api/coupon'

export default {
  name: 'Checkout',
  data() {
    return {
      defaultAddress: null,
      submitting: false,
      showCouponPopup: false,
      availableCoupons: [],
      selectedCoupon: null
    }
  },
  computed: {
    orderItems() {
      return this.$store.state.checkout?.items || []
    },
    goodsAmount() {
      return this.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    discountAmount() {
      if (!this.selectedCoupon) return 0
      return this.selectedCoupon.amount
    },
    totalAmount() {
      return Math.max(0, this.goodsAmount - this.discountAmount)
    }
  },
  created() {
    if (!this.orderItems.length) {
      Toast('请先选择商品')
      this.$router.back()
      return
    }
    this.loadAddress()
    this.loadCoupons()
  },
  methods: {
    async loadAddress() {
      const res = await getAddresses()
      this.defaultAddress = res.data.find(a => a.isDefault) || res.data[0] || null
    },
    async loadCoupons() {
      try {
        const res = await getCoupons({ type: 'available' })
        this.availableCoupons = res.data
      } catch (e) { /* ignore */ }
    },
    pickCoupon(coupon) {
      if (this.goodsAmount < coupon.minSpend) {
        Toast(`需满${coupon.minSpend}元才可使用`)
        return
      }
      this.selectedCoupon = coupon
      this.showCouponPopup = false
    },
    async submitOrder() {
      if (!this.defaultAddress) {
        Toast('请先添加收货地址')
        return
      }
      this.submitting = true
      try {
        const finalAmount = this.totalAmount
        const res = await createOrder({
          items: this.orderItems,
          totalAmount: finalAmount,
          address: this.defaultAddress
        })
        // 清空购物车中已结算的商品
        this.$store.commit('checkout/CLEAR')
        this.$store.dispatch('cart/fetchCart')
        // 跳转到支付页
        this.$router.replace({
          path: '/payment',
          query: {
            orderId: res.data.id,
            orderNo: res.data.orderNo,
            amount: finalAmount.toFixed(2)
          }
        })
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checkout-page {
  min-height: 100vh;
  background: $bg-page;
  padding-bottom: 70px;

  &__address {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-lg;
    margin: $spacing-md;
    background: $bg-card;
    border-radius: $radius-md;
    box-shadow: $shadow-card;
    cursor: pointer;

    &-info { flex: 1; }
    &-user {
      display: flex;
      gap: $spacing-lg;
      font-size: $font-lg;
      font-weight: 600;
      margin-bottom: $spacing-xs;
    }
    &-detail {
      font-size: $font-sm;
      color: $text-secondary;
      line-height: 1.5;
    }
    &-add {
      flex: 1;
      color: $color-primary;
      font-size: $font-md;
    }
  }

  &__goods {
    margin: $spacing-md;
    background: $bg-card;
    border-radius: $radius-md;
    padding: $spacing-lg;
    box-shadow: $shadow-card;

    &-title {
      font-size: $font-md;
      font-weight: 600;
      margin-bottom: $spacing-md;
    }
    &-item {
      display: flex;
      gap: $spacing-md;
      padding: $spacing-sm 0;
      & + & { border-top: 1px solid $border-color; }
    }
    &-info { flex: 1; min-width: 0; }
    &-name { font-size: $font-md; }
    &-spec { font-size: $font-sm; color: $text-placeholder; margin: $spacing-xs 0; }
    &-bottom {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      .price { font-size: $font-md; }
      span:last-child { font-size: $font-sm; color: $text-placeholder; }
    }
  }

  &__summary {
    margin: $spacing-md;
    background: $bg-card;
    border-radius: $radius-md;
    overflow: hidden;
    box-shadow: $shadow-card;
  }

  &__coupon-popup {
    max-height: 70vh;
  }

  &__coupon-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-lg;
    font-size: $font-lg;
    font-weight: 600;
    border-bottom: 1px solid $border-color;

    .van-icon { cursor: pointer; color: $text-placeholder; }
  }

  &__coupon-list {
    max-height: 50vh;
    overflow-y: auto;
    padding: $spacing-md;
  }

  &__coupon-item {
    display: flex;
    align-items: center;
    background: $bg-card;
    border-radius: $radius-md;
    margin-bottom: $spacing-md;
    box-shadow: $shadow-card;
    overflow: hidden;
    padding-right: $spacing-md;
    cursor: pointer;

    &.active {
      border: 1px solid $color-primary;
    }
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &-left {
      width: 80px;
      flex-shrink: 0;
      display: flex;
      align-items: baseline;
      justify-content: center;
      padding: $spacing-lg $spacing-sm;
      background: linear-gradient(135deg, #1AAD19, #2ecc71);
      color: $text-white;

      .symbol { font-size: $font-sm; margin-right: 2px; }
      .amount { font-size: 24px; font-weight: 700; }
    }

    &-right {
      flex: 1;
      padding: $spacing-sm $spacing-md;

      .name { font-size: $font-md; font-weight: 600; margin-bottom: 2px; }
      .condition { font-size: $font-sm; color: $text-secondary; }
      .expire { font-size: $font-xs; color: $text-placeholder; margin-top: 2px; }
    }
  }

  &__coupon-actions {
    padding: $spacing-md $spacing-lg $spacing-xl;
    text-align: center;
  }

  &__saved {
    display: block;
    font-size: $font-xs;
    color: $color-accent;
    margin-top: 2px;
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
    padding: $spacing-md $spacing-lg;
    background: $bg-card;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.06);
    z-index: 100;
  }

  &__total {
    font-size: $font-md;
    .price { font-size: $font-xl; }
  }

  &__saved {
    display: block;
    font-size: $font-xs;
    color: $color-accent;
    margin-top: 2px;
  }

  &__coupon-popup {
    max-height: 70vh;
  }

  &__coupon-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-lg;
    font-size: $font-lg;
    font-weight: 600;
    border-bottom: 1px solid $border-color;
    .van-icon { cursor: pointer; color: $text-placeholder; }
  }

  &__coupon-list {
    padding: $spacing-md;
    max-height: 50vh;
    overflow-y: auto;
  }

  &__coupon-item {
    display: flex;
    align-items: center;
    background: $bg-card;
    border-radius: $radius-md;
    margin-bottom: $spacing-md;
    box-shadow: $shadow-card;
    overflow: hidden;
    padding-right: $spacing-md;
    cursor: pointer;

    &.active {
      outline: 2px solid $color-primary;
    }
    &.disabled {
      opacity: 0.45;
    }

    &-left {
      width: 80px;
      flex-shrink: 0;
      display: flex;
      align-items: baseline;
      justify-content: center;
      padding: $spacing-lg $spacing-sm;
      background: linear-gradient(135deg, #1AAD19, #2ecc71);
      color: $text-white;
      .symbol { font-size: $font-sm; margin-right: 2px; }
      .amount { font-size: 24px; font-weight: 700; }
    }
    &-right {
      flex: 1;
      padding: $spacing-sm $spacing-md;
      .name { font-size: $font-md; font-weight: 600; }
      .condition { font-size: $font-sm; color: $text-secondary; margin-top: 2px; }
      .expire { font-size: $font-xs; color: $text-placeholder; margin-top: 2px; }
    }
  }

  &__coupon-actions {
    padding: $spacing-md $spacing-lg $spacing-lg;
    text-align: center;
  }
}
</style>
