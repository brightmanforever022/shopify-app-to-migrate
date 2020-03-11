<template>
  <div class="form__selections-view">
    this is quote item detail
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'QuoteItemDetail',
  computed: {
    ...mapGetters({
      quantity: 'order/quantity',
      options: 'order/custom_options',
      variant: 'product/variant'
    })
  }
}
</script>