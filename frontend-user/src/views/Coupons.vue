<template>
  <div class="coupons-page">
    <van-nav-bar title="优惠券" left-arrow @click-left="$router.back()" />

    <van-tabs v-model="activeTab" color="#1AAD19" @change="onTabChange">
      <van-tab title="可使用" name="available" />
      <van-tab title="已使用" name="used" />
      <van-tab title="已过期" name="expired" />
    </van-tabs>

    <div class="coupons-page__list">
      <van-loading v-if="loading" class="coupons-page__loading" />
      <van-empty v-else-if="!coupons.length" description="暂无优惠券" />
      <div v-else v-for="coupon in coupons" :key="coupon.id"
        :class="['coupons-page__card', { disabled: coupon.type !== 'available' }]">
        <div class="coupons-page__card-left">
          <span class="coupons-page__card-symbol">¥</span>
          <span class="coupons-page__card-amount">{{ coupon.amount }}</span>
        </div>
        <div class="coupons-page__card-right">
          <div class="coupons-page__card-name">{{ coupon.name }}</div>
          <div class="coupons-page__card-condition">满{{ coupon.minSpend }}元可用</div>
          <div class="coupons-page__card-expire">有效期至 {{ coupon.expireDate }}</div>
        </div>
        <van-tag v-if="coupon.type === 'used'" class="coupons-page__card-tag" color="#ccc">已使用</van-tag>
        <van-tag v-if="coupon.type === 'expired'" class="coupons-page__card-tag" color="#ccc">已过期</van-tag>
      </div>
    </div>
  </div>
</template>

<script>
import { getCoupons } from '@/api/coupon'

export default {
  name: 'Coupons',
  data() {
    return { activeTab: 'available', coupons: [], loading: false }
  },
  created() {
    this.fetchCoupons()
  },
  methods: {
    onTabChange(type) {
      this.fetchCoupons(type)
    },
    async fetchCoupons(type) {
      this.loading = true
      try {
        const res = await getCoupons({ type: type || this.activeTab })
        this.coupons = res.data
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.coupons-page {
  min-height: 100vh;
  background: $bg-page;

  &__list { padding: $spacing-md; }
  &__loading { padding-top: 20%; text-align: center; }

  &__card {
    display: flex;
    align-items: center;
    background: $bg-card;
    border-radius: $radius-md;
    margin-bottom: $spacing-md;
    box-shadow: $shadow-card;
    overflow: hidden;
    position: relative;

    &.disabled { opacity: 0.6; }

    &-left {
      width: 100px;
      flex-shrink: 0;
      display: flex;
      align-items: baseline;
      justify-content: center;
      padding: $spacing-lg;
      background: linear-gradient(135deg, #1AAD19, #2ecc71);
      color: $text-white;
    }
    &-symbol { font-size: $font-md; margin-right: 2px; }
    &-amount { font-size: 28px; font-weight: 700; }

    &-right {
      flex: 1;
      padding: $spacing-md $spacing-lg;
    }
    &-name { font-size: $font-md; font-weight: 600; margin-bottom: $spacing-xs; }
    &-condition { font-size: $font-sm; color: $text-secondary; }
    &-expire { font-size: $font-xs; color: $text-placeholder; margin-top: $spacing-xs; }

    &-tag {
      position: absolute;
      top: $spacing-sm;
      right: $spacing-sm;
    }
  }
}
</style>
