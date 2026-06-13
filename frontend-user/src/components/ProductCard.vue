<template>
  <div class="product-card" @click="$router.push(`/product/${product.id}`)">
    <div class="product-card__img">
      <van-image
        :src="product.image"
        width="100%"
        height="100%"
        fit="cover"
        lazy-load
      >
        <template #loading>
          <van-loading type="spinner" size="20" />
        </template>
      </van-image>
      <van-tag v-if="product.tags && product.tags[0]" class="product-card__tag" color="#FF6B35" plain>
        {{ product.tags[0] }}
      </van-tag>
    </div>
    <div class="product-card__info">
      <div class="product-card__name ellipsis-2">{{ product.name }}</div>
      <div class="product-card__bottom">
        <span class="price">{{ product.price }}</span>
        <span class="product-card__sales">已售{{ product.sales }}件</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: { type: Object, required: true }
  }
}
</script>

<style lang="scss" scoped>
.product-card {
  background: $bg-card;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: $shadow-card;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }

  &__img {
    position: relative;
    width: 100%;
    padding-top: 100%;
    overflow: hidden;

    .van-image {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  &__tag {
    position: absolute;
    top: $spacing-sm;
    left: $spacing-sm;
    z-index: 1;
  }

  &__info {
    padding: $spacing-sm $spacing-md $spacing-md;
  }

  &__name {
    font-size: $font-md;
    color: $text-primary;
    line-height: 1.4;
    height: 2.8em;
    margin-bottom: $spacing-xs;
  }

  &__bottom {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .price {
    font-size: $font-lg;
  }

  &__sales {
    font-size: $font-xs;
    color: $text-placeholder;
  }
}
</style>
