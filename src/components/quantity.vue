<template>
  <div class="form__row">
    <label for="field-qty" class="form__label">Quantity</label>
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
  name: 'InputQuantity',
  computed: {
    ...mapGetters({
      quantity: 'order/quantity'
    })
  },
  methods: {
    setQuantity (action) {
      if (this.quantity <= 0) {
        return false
      }

      let quantity = this.quantity
      if (action === 'plus') {
        quantity += 1
      } else {
        quantity -= 1
      }
      this.$store.dispatch('order/setQuantity', quantity)
    }
  }
}
</script>