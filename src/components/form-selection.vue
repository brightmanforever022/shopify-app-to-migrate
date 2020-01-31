<template>
  <div class="form__selections-view">
    <h4>Your selections</h4>
    <ul>
      <!-- <li>Number of doors: {{quantity}}</li>
      <li v-for="(opt, index) in variant.selectedOptions"
        :key="index"
      >
        {{opt.name}}: {{opt.value}}
      </li> -->
      <li
        v-for="(option, index) in options"
        :key="index"
      >{{option.group}}: {{option.label}}</li>
      <li>Shipping method: Free fround freight</li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FormSelection',
  computed: {
    ...mapGetters({
      quantity: 'order/quantity',
      options: 'order/custom_options',
      variant: 'product/variant'
    })
  }
}
</script>