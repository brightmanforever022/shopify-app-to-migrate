<template>
  <div class="form__selections-view">
    <div class="quote__price">
      <span class="price">{{calculated_price | money}}</span>
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

export default {
  name: 'QuoteItemDetail',
  components: {
    InputQuantity,
    QuoteSelection
  },
  mixins: [ priceMixin ],
  computed: {
    ...mapGetters({
      quantity: 'order/quantity'
    })
  }
}
</script>