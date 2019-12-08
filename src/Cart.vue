<template>
  <div class="app-main">
    <loading
      :active.sync="loading"
      is-full-page
    />
    <p>Here is cart page</p>
  </div>
</template>
<script>
import { get } from '@/api/product'
import Loading from 'vue-loading-overlay'

export default {
  name: 'Cart',
  components: {
    Loading
  },
  data () {
    return {
      loading: false
    }
  },
  created () {
    console.log('cart page created')
    this.$root.$on('set-loader', () => {
      this.loading = true
    })
    this.$root.$on('clear-loader', () => {
      this.loading = false
    })
  }
}
</script>