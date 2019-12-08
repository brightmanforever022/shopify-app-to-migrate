import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import { Plugin } from 'vue-fragment'

import App from './App.vue'
import Cart from './Cart.vue'
import store from './store'
import './filters'
// import router from './router'
import 'vue-loading-overlay/dist/vue-loading.css'
Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(Plugin)


Vue.component('v-style', {
  render: (createElement) => {
    return createElement('style', this.$slots.default)
  }
})

const pageDetect = window.PAGEDETECT
var appSelector = null
var selectedApp = null
if (pageDetect == 'cart') {
  appSelector = window.document.getElementById('d4s-customize-app-cart')
  selectedApp = Cart
} else {
  appSelector = window.document.getElementById('d4s-customize-app')
  selectedApp = App
}
if (appSelector) {
  window.VueQuizApp = new Vue({
    el: appSelector,
    store,
    // router,
    render: h => h(selectedApp)
  })
}
