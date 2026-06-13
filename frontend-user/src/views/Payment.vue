<template>
  <div class="payment-page">
    <van-nav-bar title="收银台" left-arrow @click-left="onBack" />

    <!-- 支付金额 -->
    <div class="payment-page__amount">
      <div class="payment-page__amount-label">支付金额</div>
      <div class="payment-page__amount-value">
        <span class="payment-page__amount-symbol">¥</span>
        <span class="payment-page__amount-num">{{ amount }}</span>
      </div>
      <div class="payment-page__amount-order">订单号：{{ orderNo }}</div>
    </div>

    <!-- 支付方式选择 -->
    <div class="payment-page__methods" v-if="step === 'select'">
      <div class="payment-page__methods-title">选择支付方式</div>
      <div
        v-for="method in payMethods"
        :key="method.value"
        :class="['payment-page__method', { 'payment-page__method--active': payMethod === method.value }]"
        @click="selectMethod(method.value)"
      >
        <div class="payment-page__method-icon" :style="{ background: method.color }">
          <van-icon :name="method.icon" color="#fff" size="20" />
        </div>
        <div class="payment-page__method-body">
          <div class="payment-page__method-name">{{ method.name }}</div>
          <div class="payment-page__method-desc">{{ method.desc }}</div>
        </div>
        <div :class="['payment-page__radio', { 'payment-page__radio--checked': payMethod === method.value }]">
          <van-icon v-if="payMethod === method.value" name="success" color="#fff" size="14" />
        </div>
      </div>
    </div>

    <!-- 倒计时提示 -->
    <div class="payment-page__countdown" v-if="step === 'select'">
      请在 <span>{{ countdownText }}</span> 内完成支付，超时订单将自动取消
    </div>

    <!-- 确认支付按钮 -->
    <div class="payment-page__action" v-if="step === 'select'">
      <van-button block round color="#1AAD19" size="large" @click="startPay">
        确认支付 ¥{{ amount }}
      </van-button>
    </div>

    <!-- 支付处理中 -->
    <div class="payment-page__processing" v-if="step === 'processing'">
      <div class="payment-page__processing-anim">
        <van-loading type="spinner" size="48" color="#1AAD19" />
      </div>
      <div class="payment-page__processing-text">正在处理支付...</div>
      <div class="payment-page__processing-hint">请勿关闭页面</div>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { payOrder } from '@/api/order'

export default {
  name: 'Payment',
  data() {
    return {
      orderId: null,
      orderNo: '',
      amount: '0.00',
      payMethod: 'wechat',
      step: 'select',
      countdown: 15 * 60,
      countdownTimer: null,
      payMethods: [
        { value: 'wechat', name: '微信支付', desc: '推荐使用', icon: 'chat-o', color: '#07C160' },
        { value: 'alipay', name: '支付宝', desc: '支付宝账户支付', icon: 'balance-o', color: '#1677FF' },
        { value: 'bank', name: '银行卡支付', desc: '储蓄卡/信用卡', icon: 'credit-pay', color: '#FF6B35' }
      ]
    }
  },
  computed: {
    countdownText() {
      const min = Math.floor(this.countdown / 60)
      const sec = this.countdown % 60
      return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    }
  },
  created() {
    this.orderId = this.$route.query.orderId
    this.orderNo = this.$route.query.orderNo || ''
    this.amount = this.$route.query.amount || '0.00'
    if (!this.orderId) {
      Toast('订单信息异常')
      this.$router.replace('/orders')
      return
    }
    this.startCountdown()
  },
  beforeDestroy() {
    clearInterval(this.countdownTimer)
  },
  methods: {
    selectMethod(value) {
      this.payMethod = value
    },
    startCountdown() {
      this.countdownTimer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(this.countdownTimer)
          Toast('支付超时，订单已取消')
          this.$router.replace('/orders')
        }
      }, 1000)
    },
    async startPay() {
      this.step = 'processing'
      clearInterval(this.countdownTimer)
      try {
        await new Promise(resolve => setTimeout(resolve, 2000))
        await payOrder(this.orderId)
        this.$router.replace({
          path: '/pay-result',
          query: { status: 'success', orderNo: this.orderNo, amount: this.amount }
        })
      } catch (e) {
        this.$router.replace({
          path: '/pay-result',
          query: { status: 'fail', orderNo: this.orderNo, amount: this.amount, orderId: this.orderId }
        })
      }
    },
    onBack() {
      Dialog.confirm({
        title: '确认离开',
        message: '订单尚未支付，确定要离开吗？\n可稍后在订单列表中继续支付。'
      }).then(() => {
        clearInterval(this.countdownTimer)
        this.$router.back()
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-page {
  min-height: 100vh;
  background: $bg-page;

  &__amount {
    text-align: center;
    padding: 40px 16px 24px;
    background: $bg-card;
    margin-bottom: 10px;

    &-label {
      font-size: 14px;
      color: $text-secondary;
      margin-bottom: 16px;
    }
    &-value {
      display: flex;
      align-items: baseline;
      justify-content: center;
      margin-bottom: 8px;
    }
    &-symbol {
      font-size: 22px;
      font-weight: 600;
      color: $text-primary;
      margin-right: 2px;
    }
    &-num {
      font-size: 40px;
      font-weight: 700;
      color: $text-primary;
      line-height: 1;
    }
    &-order {
      font-size: 12px;
      color: $text-placeholder;
      margin-top: 8px;
    }
  }

  &__methods {
    background: $bg-card;
    padding: 16px;

    &-title {
      font-size: 14px;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 8px;
    }
  }

  &__method {
    display: flex;
    align-items: center;
    padding: 14px 0;
    cursor: pointer;
    transition: background 0.15s;

    & + & {
      border-top: 1px solid #f0f0f0;
    }

    &--active {
      background: rgba(26, 173, 25, 0.03);
      border-radius: 8px;
      margin: 0 -8px;
      padding: 14px 8px;

      & + & {
        border-top: none;
      }
    }

    &-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    &-body {
      flex: 1;
      min-width: 0;
      margin: 0 12px;
    }

    &-name {
      font-size: 15px;
      font-weight: 500;
      color: $text-primary;
      line-height: 1.4;
    }

    &-desc {
      font-size: 12px;
      color: $text-placeholder;
      margin-top: 2px;
    }
  }

  &__radio {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #ddd;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    box-sizing: border-box;

    &--checked {
      border-color: #1AAD19;
      background: #1AAD19;
    }

    &-check {
      display: block;
      width: 6px;
      height: 10px;
      border: solid #fff;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      margin-top: -2px;
    }
  }

  &__countdown {
    text-align: center;
    font-size: 12px;
    color: $text-placeholder;
    padding: 20px 16px 12px;

    span {
      color: $color-accent;
      font-weight: 600;
    }
  }

  &__action {
    padding: 8px 24px 32px;
  }

  &__processing {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 30vh;

    &-anim {
      margin-bottom: 24px;
    }
    &-text {
      font-size: 16px;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 8px;
    }
    &-hint {
      font-size: 12px;
      color: $text-placeholder;
    }
  }
}
</style>
