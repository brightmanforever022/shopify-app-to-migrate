<template>
  <div class="app-main">
    <loading
      :active.sync="loading"
      is-full-page
    />
    <customize
      v-if="!loading && isPDP"
      :openDisplayCart="openDisplayCart"
      :closeDiaplayCart="closeDiaplayCart"
      
    ></customize>
    <div
      class="overlay__bg minicart"
      :class="{'visibled': display_cart_opened}"
      :key="display-cart"
      @click.prevent="closeDisplayCart"
    ></div>
    <minicart
      v-show="display_cart_opened"
      :close="closeDisplayCart"
      :continue_shopping="closeDisplayCart"
    >
    </minicart>
  </div>
</template>
<script>
import $ from 'jquery'
import { get } from '@/api/product'
import Loading from 'vue-loading-overlay'
import Customize from '@/components/customize'
import Minicart from '@/components/minicart'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  name: 'App',
  components: {
    Loading,
    Customize,
    Minicart
  },
  data () {
    return {
      loading: false,
      isPDP: false,
      display_cart_opened: false
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
      if (id != 'empty') {
        this.loading = true
        this.isPDP = true
        get(id).then(res => {
          let product = res.data.product.data
          this.$store.dispatch('product/set', product)
          this.$store.dispatch('order/setVariant', product.variants.edges[0].node)
          this.$store.dispatch('template/set_template', res.data.template[0])
        }).catch(err => {
          console.log(err)
        }).then(() => {
          this.loading = false
        })
      }
    },

    openDisplayCart () {
      this.display_cart_opened = true
      $('.product__details').css('z-index', '-1')
      $('#shopify-section-header .header').css('z-index', '-1')
    },
    closeDisplayCart () {
      this.display_cart_opened = false
      $('.product__details').css('z-index', 'initial')
      $('#shopify-section-header .header').css('z-index', '101')
    }
    
  }
}
</script>