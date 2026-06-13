<template>
  <div class="pay-result-page">
    <van-nav-bar title="支付结果" />

    <div class="pay-result-page__content">
      <!-- 成功 -->
      <template v-if="isSuccess">
        <div class="pay-result-page__icon pay-result-page__icon--success">
          <van-icon name="checked" size="60" color="#1AAD19" />
        </div>
        <div class="pay-result-page__title">支付成功</div>
        <div class="pay-result-page__amount">¥{{ amount }}</div>
        <div class="pay-result-page__info">订单号：{{ orderNo }}</div>
      </template>

      <!-- 失败 -->
      <template v-else>
        <div class="pay-result-page__icon pay-result-page__icon--fail">
          <van-icon name="close" size="60" color="#ee0a24" />
        </div>
        <div class="pay-result-page__title">支付失败</div>
        <div class="pay-result-page__info">请检查支付方式后重试</div>
      </template>
    </div>

    <div class="pay-result-page__actions">
      <van-button
        v-if="isSuccess"
        block
        round
        color="#1AAD19"
        @click="$router.replace('/orders')"
      >
        查看订单
      </van-button>
      <van-button
        v-else
        block
        round
        color="#1AAD19"
        @click="retryPay"
      >
        重新支付
      </van-button>
      <van-button
        block
        round
        plain
        color="#999"
        @click="$router.replace('/home')"
        class="pay-result-page__btn-home"
      >
        返回首页
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayResult',
  computed: {
    isSuccess() {
      return this.$route.query.status === 'success'
    },
    orderNo() {
      return this.$route.query.orderNo || ''
    },
    amount() {
      return this.$route.query.amount || '0.00'
    }
  },
  methods: {
    retryPay() {
      const { orderNo, amount } = this.$route.query
      const orderId = this.$route.query.orderId
      this.$router.replace({
        path: '/payment',
        query: { orderId, orderNo, amount }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-result-page {
  min-height: 100vh;
  background: $bg-page;

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-xl * 3 $spacing-lg $spacing-xl;
  }

  &__icon {
    margin-bottom: $spacing-xl;

    &--success {
      animation: resultBounce 0.5s ease;
    }
    &--fail {
      animation: resultBounce 0.5s ease;
    }
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  &__amount {
    font-size: 28px;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }

  &__info {
    font-size: $font-sm;
    color: $text-placeholder;
  }

  &__actions {
    padding: $spacing-xl * 2 $spacing-xl 0;
  }

  &__btn-home {
    margin-top: $spacing-md;
  }
}

@keyframes resultBounce {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}
</style>
