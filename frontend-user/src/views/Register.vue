<template>
  <div class="register-page">
    <van-nav-bar title="注册" left-arrow @click-left="$router.back()" />

    <div class="register-page__body">
      <div class="register-page__form">
        <van-form @submit="onSubmit" ref="regForm">
          <van-field
            v-model="form.username"
            placeholder="请输入用户名（3-16位）"
            left-icon="user-o"
            :rules="[
              { required: true, message: '请输入用户名' },
              { pattern: /^.{3,16}$/, message: '用户名需3-16位' }
            ]"
            clearable
          />
          <van-field
            v-model="form.phone"
            placeholder="请输入手机号"
            left-icon="phone-o"
            type="tel"
            maxlength="11"
            :rules="[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
            ]"
            clearable
          />
          <van-field
            v-model="form.password"
            placeholder="请输入密码（6-20位）"
            :type="showPwd ? 'text' : 'password'"
            left-icon="lock"
            :right-icon="showPwd ? 'eye-o' : 'closed-eye'"
            @click-right-icon="showPwd = !showPwd"
            :rules="[
              { required: true, message: '请输入密码' },
              { pattern: /^.{6,20}$/, message: '密码需6-20位' }
            ]"
          />
          <van-field
            v-model="form.confirmPassword"
            placeholder="请确认密码"
            :type="showPwd2 ? 'text' : 'password'"
            left-icon="lock"
            :right-icon="showPwd2 ? 'eye-o' : 'closed-eye'"
            @click-right-icon="showPwd2 = !showPwd2"
            :rules="[
              { required: true, message: '请确认密码' },
              { validator: checkConfirm, message: '两次密码不一致' }
            ]"
          />

          <div class="register-page__actions">
            <van-button
              round
              block
              type="primary"
              color="#1AAD19"
              native-type="submit"
              :loading="loading"
              loading-text="注册中..."
            >
              注册
            </van-button>
            <div class="register-page__links">
              <span @click="$router.push('/login')">已有账号？去登录</span>
            </div>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'

export default {
  name: 'Register',
  data() {
    return {
      form: { username: '', phone: '', password: '', confirmPassword: '' },
      showPwd: false,
      showPwd2: false,
      loading: false
    }
  },
  methods: {
    checkConfirm(val) {
      return val === this.form.password
    },
    async onSubmit() {
      this.loading = true
      try {
        await this.$store.dispatch('user/register', {
          username: this.form.username,
          phone: this.form.phone,
          password: this.form.password
        })
        Toast.success('注册成功')
        this.$router.replace('/login')
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
.register-page {
  min-height: 100vh;
  background: $bg-page;

  &__body {
    padding: $spacing-xl;
  }

  &__form {
    background: $bg-card;
    border-radius: $radius-lg;
    padding: $spacing-xl;
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
