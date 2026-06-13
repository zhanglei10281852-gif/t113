<template>
  <div class="address-page">
    <van-nav-bar title="收货地址" left-arrow @click-left="$router.back()" />

    <div class="address-page__list">
      <van-loading v-if="loading" class="address-page__loading" />
      <van-empty v-else-if="!addresses.length" description="暂无收货地址" />
      <van-swipe-cell v-for="addr in addresses" :key="addr.id" class="address-page__cell">
        <div class="address-page__item" @click="editAddr(addr)">
          <div class="address-page__item-info">
            <div class="address-page__item-user">
              <span>{{ addr.name }}</span>
              <span>{{ addr.phone }}</span>
              <van-tag v-if="addr.isDefault" color="#1AAD19" round size="mini">默认</van-tag>
            </div>
            <div class="address-page__item-detail">
              {{ addr.province }} {{ addr.city }} {{ addr.district }} {{ addr.detail }}
            </div>
          </div>
          <van-icon name="edit" color="#999" />
        </div>
        <template #right>
          <van-button square type="danger" text="删除" class="address-page__delete" @click="handleDelete(addr.id)" />
        </template>
      </van-swipe-cell>
    </div>

    <div class="address-page__add">
      <van-button block round color="#1AAD19" icon="plus" @click="showForm = true">新增地址</van-button>
    </div>

    <!-- 新增/编辑弹窗 -->
    <van-popup v-model="showForm" position="bottom" round class="address-page__popup">
      <div class="address-page__form">
        <div class="address-page__form-title">{{ editingId ? '编辑地址' : '新增地址' }}</div>
        <van-form @submit="onSubmit">
          <van-field v-model="form.name" label="姓名" placeholder="收货人姓名" :rules="[{required:true,message:'请输入姓名'}]" />
          <van-field v-model="form.phone" label="电话" type="tel" placeholder="手机号" :rules="[{required:true,message:'请输入电话'}]" />
          <van-field v-model="form.province" label="省份" placeholder="省/直辖市" :rules="[{required:true,message:'请输入省份'}]" />
          <van-field v-model="form.city" label="城市" placeholder="市" :rules="[{required:true,message:'请输入城市'}]" />
          <van-field v-model="form.district" label="区县" placeholder="区/县" :rules="[{required:true,message:'请输入区县'}]" />
          <van-field v-model="form.detail" label="详细地址" placeholder="街道、门牌号等" :rules="[{required:true,message:'请输入详细地址'}]" />
          <van-cell center title="设为默认地址">
            <template #right-icon>
              <van-checkbox v-model="form.isDefault" checked-color="#1AAD19" />
            </template>
          </van-cell>
          <div style="padding: 16px;">
            <van-button block round color="#1AAD19" native-type="submit" :loading="saving">保存</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import { getAddresses, addAddress, updateAddress, deleteAddress } from '@/api/address'

export default {
  name: 'Address',
  data() {
    return {
      addresses: [],
      loading: false,
      showForm: false,
      saving: false,
      editingId: null,
      form: { name: '', phone: '', province: '', city: '', district: '', detail: '', isDefault: false }
    }
  },
  created() {
    this.fetchAddresses()
  },
  methods: {
    async fetchAddresses() {
      this.loading = true
      try {
        const res = await getAddresses()
        this.addresses = res.data
      } finally {
        this.loading = false
      }
    },
    editAddr(addr) {
      this.editingId = addr.id
      this.form = { ...addr }
      this.showForm = true
    },
    resetForm() {
      this.editingId = null
      this.form = { name: '', phone: '', province: '', city: '', district: '', detail: '', isDefault: false }
    },
    async onSubmit() {
      this.saving = true
      try {
        if (this.editingId) {
          await updateAddress(this.editingId, this.form)
          Toast.success('修改成功')
        } else {
          await addAddress(this.form)
          Toast.success('添加成功')
        }
        this.showForm = false
        this.resetForm()
        this.fetchAddresses()
      } finally {
        this.saving = false
      }
    },
    async handleDelete(id) {
      try {
        await Dialog.confirm({ message: '确定删除该地址吗？' })
      } catch { return }
      await deleteAddress(id)
      Toast.success('已删除')
      this.fetchAddresses()
    }
  }
}
</script>

<style lang="scss" scoped>
.address-page {
  min-height: 100vh;
  background: $bg-page;
  padding-bottom: 80px;

  &__list { padding: $spacing-md; }
  &__loading { padding-top: 20%; text-align: center; }

  &__cell {
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
    box-shadow: $shadow-card;
    border-radius: $radius-md;

    &-info { flex: 1; }
    &-user {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      font-size: $font-md;
      font-weight: 600;
      margin-bottom: $spacing-xs;
    }
    &-detail {
      font-size: $font-sm;
      color: $text-secondary;
      line-height: 1.5;
    }
  }

  &__delete { height: 100%; }

  &__add {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 750px;
    margin: 0 auto;
    padding: $spacing-lg;
    background: $bg-card;
  }

  &__popup { max-height: 85vh; }
  &__form {
    padding: $spacing-lg;
    &-title {
      font-size: $font-lg;
      font-weight: 600;
      text-align: center;
      margin-bottom: $spacing-lg;
    }
  }
}
</style>
