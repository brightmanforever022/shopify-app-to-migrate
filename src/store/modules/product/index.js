import { get } from '@/api/product'

const product = {
  namespaced: true,
  state: {
    product: {},
    variant: {}
  },
  actions: {
    get ({commit}, id) {
      return new Promise((resolve, reject) => {
        get(id).then(res => {
          commit('SET_PRODUCT', res.data.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    set ({commit}, data) {
      commit('SET_PRODUCT', data)
    },
    setVariant ({commit}, option) {
      commit('SET_VARIANT', option)
    }
  },
  mutations: {
    SET_PRODUCT: (state, data) => {
      if (data) {
        state.product = data
        state.variant = data.variants.edges[0].node
      }
    },
    SET_VARIANT: (state, option) => {
      if (option) {
        let selected_options = JSON.parse(JSON.stringify(state.variant.selectedOptions))
        let index = selected_options.findIndex(opt => opt.name === option.name)
        selected_options[index] = option
        let variant = state.product.variants.edges.find(edge => JSON.stringify(selected_options) === JSON.stringify(edge.node.selectedOptions))
        if (variant) {
          state.variant = variant.node
        }
      }
    }
  },
  getters: {
    get (state) {
      return state.product
    },
    options (state) {
      return state.product.options
    },
    variants (state) {
      return state.product.variants
    },
    variant (state) {
      return state.variant
    }
  }
}

export default product
