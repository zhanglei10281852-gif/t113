<template>
  <div class="login-page">
    <div class="login-page__header">
      <div class="login-page__brand">
        <van-icon name="shop-o" size="48" color="#1AAD19" />
        <h1 class="login-page__title">鲜购</h1>
        <p class="login-page__subtitle">新鲜好物，尽在鲜购</p>
      </div>
    </div>

    <div class="login-page__form">
      <van-form @submit="onSubmit" ref="loginForm">
        <van-field
          v-model="form.username"
          name="username"
          label=""
          placeholder="请输入用户名"
          left-icon="user-o"
          :rules="[{ required: true, message: '请输入用户名' }]"
          clearable
        />
        <van-field
          v-model="form.password"
          name="password"
          label=""
          placeholder="请输入密码"
          :type="showPwd ? 'text' : 'password'"
          left-icon="lock"
          :right-icon="showPwd ? 'eye-o' : 'closed-eye'"
          @click-right-icon="showPwd = !showPwd"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
        <div class="login-page__actions">
          <van-button
            round
            block
            type="primary"
            color="#1AAD19"
            native-type="submit"
            :loading="loading"
            loading-text="登录中..."
          >
            登录
          </van-button>
          <div class="login-page__links">
            <span @click="$router.push('/register')">还没有账号？立即注册</span>
          </div>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'

export default {
  name: 'Login',
  data() {
    return {
      form: { username: '', password: '' },
      showPwd: false,
      loading: false
    }
  },
  methods: {
    async onSubmit() {
      this.loading = true
      try {
        await this.$store.dispatch('user/login', this.form)
        Toast.success('登录成功')
        const redirect = this.$route.query.redirect || '/home'
        this.$router.replace(redirect)
      } catch (e) {
        // 错误已在拦截器中处理
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e8f8e8 0%, $bg-page 40%);

  &__header {
    padding: 60px $spacing-xl 30px;
    text-align: center;
  }

  &__brand {
    .van-icon {
      margin-bottom: $spacing-md;
    }
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    color: $color-primary;
    margin: $spacing-sm 0;
  }

  &__subtitle {
    font-size: $font-md;
    color: $text-secondary;
  }

  &__form {
    padding: $spacing-xl;
    margin: 0 $spacing-lg;
    background: $bg-card;
    border-radius: $radius-lg;
    box-shadow: $shadow-card;

    .van-field {
      margin-bottom: $spacing-md;
      background: #f8f8f8;
      border-radius: $radius-md;

      ::v-deep .van-field__left-icon {
        color: $color-primary;
      }
    }
  }

  &__actions {
    margin-top: $spacing-xl;

    .van-button {
      height: 44px;
      font-size: $font-lg;
    }
  }

  &__links {
    text-align: center;
    margin-top: $spacing-lg;
    font-size: $font-sm;
    color: $color-primary;

    span {
      cursor: pointer;
    }
  }

}
</style>
