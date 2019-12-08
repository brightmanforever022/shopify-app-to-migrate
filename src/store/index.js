import Vue from 'vue'
import Vuex from 'vuex'

import product from './modules/product'
import order from './modules/order'
import cart from './modules/cart'
import wishlist from './modules/wishlist'
import template from './modules/template'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    product,
    order,
    cart,
    wishlist,
    template
  }
})
