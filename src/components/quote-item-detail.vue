<template>
  <div class="form__selections-view">
    <div class="quote__price" v-if="existPrice">
      <span class="item-price">{{estimatedItemPrice}}/ea</span>
      <span class="price sub-total">SubTotal&nbsp;&nbsp;{{estimatedPrice | money}}</span>
    </div>
    <input-quantity></input-quantity>
    <quote-selection
      v-if="customizable && fully_customized"
    ></quote-selection>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import InputQuantity from '@/components/quantity'
import QuoteSelection from '@/components/quote-selection'
import $ from 'jquery'
import priceMixin from '@/mixins/price'
import { getDiscountByQuantity } from '@/helpers'

export default {
  name: 'QuoteItemDetail',
  components: {
    InputQuantity,
    QuoteSelection
  },
  mixins: [ priceMixin ],
  computed: {
    ...mapGetters({
      quantity: 'order/quantity',
      product: 'product/get',
    }),
    existPrice() {
      return this.fully_customized
    },
    estimatedItemPrice() {
      const estimatedPrice = (100 - getDiscountByQuantity(this.product.metafield.value, this.quantity)) * this.calculated_item_price / 100
      return estimatedPrice.toFixed(2)
    },
    estimatedPrice() {
      const estimatedPrice = (100 - getDiscountByQuantity(this.product.metafield.value, this.quantity)) * this.calculated_item_price / 100 * this.quantity
      return estimatedPrice.toFixed(2)
    }
  }
}
</script>