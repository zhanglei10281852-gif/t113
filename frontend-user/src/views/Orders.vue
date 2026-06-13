<template>
  <div class="orders-page">
    <van-nav-bar title="我的订单" left-arrow @click-left="$router.back()" />

    <van-tabs v-model="activeTab" color="#1AAD19" @change="onTabChange">
      <van-tab title="全部" :name="-1" />
      <van-tab title="待付款" :name="0" />
      <van-tab title="待发货" :name="1" />
      <van-tab title="待收货" :name="2" />
      <van-tab title="已完成" :name="3" />
    </van-tabs>

    <div class="orders-page__list">
      <van-loading v-if="loading" class="orders-page__loading" />
      <van-empty v-else-if="!orders.length" description="暂无订单" />
      <div v-else v-for="order in orders" :key="order.id" class="orders-page__card">
        <div class="orders-page__card-header">
          <span class="orders-page__card-no">{{ order.orderNo }}</span>
          <span :class="['orders-page__card-status', 'status-' + order.status]">{{ order.statusText }}</span>
        </div>
        <div v-for="item in order.items" :key="item.productId" class="orders-page__card-item">
          <van-image :src="item.image" width="60" height="60" fit="cover" radius="4" />
          <div class="orders-page__card-info">
            <div class="ellipsis">{{ item.name }}</div>
            <div class="orders-page__card-meta">
              <span class="price">{{ item.price }}</span>
              <span>x{{ item.quantity }}</span>
            </div>
          </div>
        </div>
        <div class="orders-page__card-footer">
          <span class="orders-page__card-total">共{{ order.items.length }}件 合计：<span class="price">{{ order.totalAmount.toFixed(2) }}</span></span>
          <div class="orders-page__card-actions">
            <van-button v-if="order.status === 0" plain round size="small" @click="handleCancel(order)">取消</van-button>
            <van-button v-if="order.status === 0" round size="small" color="#1AAD19" @click="handlePay(order)">去付款</van-button>
            <van-button v-if="order.status === 2" round size="small" color="#1AAD19" @click="handleConfirm(order)">确认收货</van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import { getOrders, cancelOrder, confirmOrder } from '@/api/order'

export default {
  name: 'Orders',
  data() {
    return { activeTab: -1, orders: [], loading: false }
  },
  created() {
    this.fetchOrders()
  },
  methods: {
    onTabChange(status) {
      this.fetchOrders(status)
    },
    async fetchOrders(status) {
      this.loading = true
      try {
        const res = await getOrders({ status: status !== undefined ? status : this.activeTab })
        this.orders = res.data
      } finally {
        this.loading = false
      }
    },
    async handleCancel(order) {
      try {
        await Dialog.confirm({ message: '确定取消订单吗？' })
      } catch { return }
      await cancelOrder(order.id)
      Toast.success('已取消')
      this.fetchOrders(this.activeTab)
    },
    async handlePay(order) {
      this.$router.push({
        path: '/payment',
        query: {
          orderId: order.id,
          orderNo: order.orderNo,
          amount: order.totalAmount.toFixed(2)
        }
      })
    },
    async handleConfirm(order) {
      try {
        await Dialog.confirm({ message: '确认已收到商品？' })
      } catch { return }
      await confirmOrder(order.id)
      Toast.success('已确认收货')
      this.fetchOrders(this.activeTab)
    }
  }
}
</script>

<style lang="scss" scoped>
.orders-page {
  min-height: 100vh;
  background: $bg-page;

  &__list { padding: $spacing-md; }
  &__loading { padding-top: 20%; text-align: center; }

  &__card {
    background: $bg-card;
    border-radius: $radius-md;
    padding: $spacing-lg;
    margin-bottom: $spacing-md;
    box-shadow: $shadow-card;

    &-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: $spacing-md;
      padding-bottom: $spacing-sm;
      border-bottom: 1px solid $border-color;
    }
    &-no { font-size: $font-sm; color: $text-placeholder; }
    &-status {
      font-size: $font-sm;
      font-weight: 600;
      &.status-0 { color: $color-accent; }
      &.status-1, &.status-2 { color: $color-primary; }
      &.status-3 { color: $text-placeholder; }
      &.status-4 { color: $text-placeholder; }
    }
    &-item {
      display: flex;
      gap: $spacing-md;
      padding: $spacing-sm 0;
    }
    &-info {
      flex: 1;
      min-width: 0;
      font-size: $font-md;
    }
    &-meta {
      display: flex;
      justify-content: space-between;
      margin-top: $spacing-xs;
      .price { font-size: $font-sm; }
      span:last-child { font-size: $font-sm; color: $text-placeholder; }
    }
    &-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: $spacing-md;
      padding-top: $spacing-sm;
      border-top: 1px solid $border-color;
    }
    &-total {
      font-size: $font-sm;
      color: $text-secondary;
      .price { font-size: $font-md; }
    }
    &-actions {
      display: flex;
      gap: $spacing-sm;
    }
  }
}
</style>
