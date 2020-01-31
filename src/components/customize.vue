<template>
  <fragment>
    <div class="product__form--instock">
      <div class="stock__shipping-delivery">
        <h3>{{stock}}</h3>
        <p>Order today and receive it by October 12 - 16.</p>
      </div>
      <div class="made__in">
        <img src="//cdn.shopify.com/s/files/1/0036/4393/2761/t/6/assets/made-in-usa.svg?31567" alt="" />
      </div>
    </div>
    <div class="product__form-container">
      <div class="product__form-container--header">
        <div class="product__form--price">
          From
          <span class="price">{{calculated_price | money}}</span>
        </div>
        <div class="product__form--request-quote">
          <a href="">Request a Quote</a>
        </div>
      </div>

      <div class="form__body">
        <input-quantity></input-quantity>
        <!-- <variant-selection></variant-selection> -->
        <form-description></form-description>
        <form-selection
          v-if="customizable && fully_customized"
        ></form-selection>
        <form-actions></form-actions>
      </div>
    </div>
  </fragment>
</template>
<script>
import InputQuantity from '@/components/quantity'
// import VariantSelection from '@/components/variant-selection'
import FormDescription from '@/components/form-description'
import FormSelection from '@/components/form-selection'
import FormActions from '@/components/form-actions'
import { mapGetters } from 'vuex'
import priceMixin from '@/mixins/price'

export default {
  name: 'Customize',
  components: {
    InputQuantity,
    // VariantSelection,
    FormDescription,
    FormSelection,
    FormActions
  },
  mixins: [ priceMixin ],
  computed: {
    ...mapGetters({
      variant: 'product/variant',
      quantity: 'order/quantity'
    }),
    stock () {
      return this.variant.inventoryQuantity > 0 ? 'In stock' : 'Out of stock'
    }
  }
}
</script>