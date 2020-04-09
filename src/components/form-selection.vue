<template>
  <div class="form__selections-view">
    <h4>Your selections</h4>
    <ul>
      <li
        v-for="(option, index) in options"
        :key="index"
      >{{option.group}}: {{option.label}}</li>
      <!-- <li>Shipping method: Free ground freight</li> -->
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
    })
  }
}
</script>