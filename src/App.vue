<template>
  <div class="app-main">
    <loading
      :active.sync="loading"
      is-full-page
    />
    <customize
      v-if="!loading"
    ></customize>
  </div>
</template>
<script>
import { get } from '@/api/product'
import Loading from 'vue-loading-overlay'
import Customize from '@/components/customize'

export default {
  name: 'App',
  components: {
    Loading,
    Customize
  },
  data () {
    return {
      loading: false
    }
  },
  created () {
    this.$root.$on('set-loader', () => {
      this.loading = true
    })
    this.$root.$on('clear-loader', () => {
      this.loading = false
    })
    this.loadProduct()
  },
  methods: {
    loadProduct () {
      let id = window.PRODUCT_ID
      if (id) {
        this.loading = true
        get(id).then(res => {
          let product = res.data.product.data
          this.$store.dispatch('product/set', product)
          this.$store.dispatch('order/setVariant', product.variants.edges[0].node)
          this.$store.dispatch('template/set_templates', res.data.templates)
        }).catch(err => {
          console.log(err)
        }).then(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>