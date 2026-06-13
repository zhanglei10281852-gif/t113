<template>
  <div class="profile-page">
    <div class="profile-page__header">
      <div class="profile-page__avatar">
        <van-image
          v-if="userInfo"
          :src="userInfo.avatar"
          width="64"
          height="64"
          round
          fit="cover"
        >
          <template #error>
            <van-icon name="user-o" size="32" color="#fff" />
          </template>
        </van-image>
        <van-icon v-else name="user-o" size="32" color="#fff" />
      </div>
      <div class="profile-page__info">
        <div class="profile-page__name">{{ userInfo ? userInfo.username : '未登录' }}</div>
        <div class="profile-page__phone" v-if="userInfo">{{ userInfo.phone }}</div>
      </div>
    </div>

    <div class="profile-page__menu">
      <van-cell-group inset>
        <van-cell title="我的订单" icon="orders-o" is-link to="/orders" />
        <van-cell title="收货地址" icon="location-o" is-link to="/address" />
        <van-cell title="我的收藏" icon="like-o" is-link to="/favorites" />
        <van-cell title="优惠券" icon="coupon-o" is-link to="/coupons" />
      </van-cell-group>

      <van-cell-group inset class="profile-page__menu-group">
        <van-cell title="帮助中心" icon="question-o" is-link @click="showTip" />
        <van-cell title="意见反馈" icon="comment-o" is-link @click="showTip" />
        <van-cell title="关于我们" icon="info-o" is-link @click="showAbout" />
      </van-cell-group>

      <div class="profile-page__logout" v-if="isLoggedIn">
        <van-button block round plain color="#ee0a24" @click="handleLogout">退出登录</van-button>
      </div>
    </div>

    <div style="height: 60px;"></div>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Profile',
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState('user', ['userInfo'])
  },
  methods: {
    showTip() {
      Toast('功能开发中')
    },
    showAbout() {
      Dialog.alert({
        title: '关于鲜购',
        message: '鲜购 v1.0.0\n新鲜好物，尽在鲜购\n\n技术栈：Vue 2 + Vant 2 + Vuex + Vue Router'
      })
    },
    handleLogout() {
      Dialog.confirm({ title: '提示', message: '确定退出登录吗？' })
        .then(() => {
          this.$store.dispatch('user/logout')
          Toast.success('已退出')
          this.$router.replace('/login')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: $bg-page;

  &__header {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    padding: 40px $spacing-xl $spacing-xl;
    background: linear-gradient(135deg, #1AAD19, #2ecc71);
    border-radius: 0 0 $radius-lg $radius-lg;
  }

  &__avatar {
    width: 64px;
    height: 64px;
    border-radius: $radius-round;
    background: rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__info {
    color: $text-white;
  }

  &__name {
    font-size: $font-xl;
    font-weight: 600;
    margin-bottom: $spacing-xs;
  }

  &__phone {
    font-size: $font-sm;
    opacity: 0.8;
  }

  &__menu {
    padding: $spacing-lg 0;

    &-group {
      margin-top: $spacing-md;
    }
  }

  &__logout {
    padding: $spacing-xl;
  }
}
</style>
