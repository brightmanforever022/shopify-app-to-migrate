<template>
  <div class="form__selections-view">
    <div class="cart-line" v-for="line_item in line_items" :key="line_item.lineId">
      <div class="cart-line-detail">
        <div class="quote__price">
          <span class="item-price">{{lineItemSinglePrice(line_item) | money}}/ea</span>
          <span class="price sub-total">SubTotal&nbsp;&nbsp;{{lineItemPrice(line_item) | money}}</span>
        </div>
        <cart-quantity :quantity="line_item.quantity" :line_id="line_item.lineId"></cart-quantity>
        <minicart-form-selection :line_id="line_item.lineId"></minicart-form-selection>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CartQuantity from '@/components/cart-quantity'
// import QuoteCartSelection from '@/components/quote-cart-selection'
import MinicartFormSelection from '@/components/minicart-form-selection'
import $ from 'jquery'
import priceMixin from '@/mixins/price'
import { getDiscountByQuantity } from '@/helpers'

export default {
  name: 'QuoteItemDetail',
  components: {
    CartQuantity,
    // QuoteCartSelection,
    MinicartFormSelection
  },
  mixins: [ priceMixin ],
  computed: {
    ...mapGetters({
      line_items: 'cart/get_line_items',
      cart_count: 'cart/get_cart_count',
      cal_total: 'cart/get_total',
      sub_total: 'cart/get_sub_total',
    }),
  },
  methods: {
    lineItemSinglePrice (lineItem) {
      return (100 - getDiscountByQuantity(lineItem.shipping_summary, lineItem.quantity)) * lineItem.calculated_item_price / 100
    },
    lineItemPrice (lineItem) {
      return this.lineItemSinglePrice(lineItem) * lineItem.quantity
    },
  },
}
</script>