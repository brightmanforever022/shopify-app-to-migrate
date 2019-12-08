<template>
  <div class="form__row cart-quantity">
    <div class="counter">
      <span class="counter__minus" @click.prevent="setQuantity('minus')">&nbsp;</span>
      <input type="number" class="counter__field" name="quantity" id="field-qty" v-model="quantity" min="1" readonly/>
      <span class="counter__plus" @click.prevent="setQuantity('plus')">&nbsp;</span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CartInputQuantity',
  props: {
		quantity: {
			type: Number,
			default: () => 0
		},
		line_id: {
			type: String,
			default: () => ''
		}
  },
  computed: {
    ...mapGetters({
      lineQuantity: 'cart/get_quantity_by_id'
    })
  },
  methods: {
    setQuantity (action) {
      if (this.quantity <= 0) {
        return false
      }

      let quantity = this.quantity
      if (action === 'plus') {
        this.$store.dispatch('cart/plusCart', this.line_id)
      } else {
        this.$store.dispatch('cart/minusCart', this.line_id)
      }
    }
  }
}
</script>