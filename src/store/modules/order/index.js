import { createOrder } from '@/api/order'

const order = {
  namespaced: true,
  state: {
    quantity: 1,
    variant_id: null,
    custom_options: []
  },
  actions: {
    setQuantity ({commit}, quantity) {
      commit('SET_QUANTITY', quantity)
    },
    setVariant ({commit}, variant) {
      commit('SET_VARIANT', variant)
    },
    initCustomization ({commit}) {
      commit('SET_INIT')
    },
    upsert_customization ({commit}, option) {
      commit('UPSERT_OPTION', option)
    },
    create_order({commit}, data) {
      return new Promise((resolve, reject) => {
        createOrder(data).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
  mutations: {
    SET_QUANTITY: (state, quantity) => {
      if (quantity) {
        state.quantity = quantity
      }
    },
    SET_VARIANT: (state, variant) => {
      if (variant) {
        let variant_id = variant.id.split('/')[variant.id.split('/').length - 1]
        state.variant_id = variant_id
      } else {
        state.variant_id = null
      }
    },
    SET_INIT: (state) => {
      state.custom_options = []
    },
    UPSERT_OPTION: (state, option) => {
      let options = state.custom_options
      if (option) {
        options = options.filter(opt => opt.group_id !== option.group_id)
        options = [...options, option]
        state.custom_options = options
      }
    }
  },
  getters: {
    quantity (state) {
      return state.quantity
    },
    variant_id (state) {
      return state.variant_id
    },
    custom_options (state) {
      return state.custom_options
    }
  }
}

export default order
