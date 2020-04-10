<template>
  <div class="form__row">
    <label for="field-qty" class="form__label">Quantity</label>
    <div class="counter">
      <span class="counter__minus" @click.prevent="setQuantity('minus')" v-longclick="() => setQuantity('minus')">&nbsp;</span>
      <input type="number" class="counter__field" name="quantity" id="field-qty" v-model="quantity" min="1" readonly/>
      <span class="counter__plus" @click.prevent="setQuantity('plus')" v-longclick="() => setQuantity('plus')">&nbsp;</span>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { longClickDirective } from 'vue-long-click'
export default {
  name: 'InputQuantity',
  computed: {
    ...mapGetters({
      quantity: 'order/quantity'
    })
  },
  created () {
    const longClickInstance = longClickDirective({delay: 400, interval: 50})
    Vue.directive('longclick', longClickInstance)
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