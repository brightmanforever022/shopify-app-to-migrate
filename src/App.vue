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
      :continue_shopping="closeDisplayCart"
    >
    </minicart>
  </div>
</template>
<script>
import $ from 'jquery'
import { getProduct } from '@/api/product'
import { getFreightOptions } from '@/api/cart'
import { getSettings } from '@/api/settings'
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
    // this.loadSettings()
    this.loadFreightoptions()
  },
  methods: {
    loadProduct () {
      let id = window.PRODUCT_ID
      if (id != 'empty') {
        this.loading = true
        this.isPDP = true
        getProduct(id).then(res => {
          let product = res.data.product.data
          // this.$store.dispatch('cart/setFreightOptionList', res.data.freightoptions)
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

    loadFreightoptions () {
      getFreightOptions().then(res => {
        const freightOptions = res.data.freightoptions
        this.$store.dispatch('cart/setFreightOptionList', freightOptions)
      }).catch(err => {
        console.log('load freight options error: ', err)
      })
    },

    loadSettings() {
      getSettings().then(res => {
        const settings = res.data.settings
        this.$store.dispatch('settings/setSettings', settings)
      }).catch(err => {
        console.log('load settings error: ', err)
      })
    },

    openDisplayCart () {
      this.display_cart_opened = true
      $('.product__details').css('z-index', '-1')
      $('#shopify-section-header .header').css('z-index', '-1')
      $('body').css('position', 'fixed');
    },
    closeDisplayCart () {
      this.display_cart_opened = false
      $('.product__details').css('z-index', 'initial')
      $('#shopify-section-header .header').css('z-index', '101')
      $('body').css('position', 'inherit');
    }
    
  }
}
</script>