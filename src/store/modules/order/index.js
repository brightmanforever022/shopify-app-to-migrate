import { createOrder } from '@/api/order'

const order = {
  namespaced: true,
  state: {
    quantity: 1,
    variant_id: null,
    custom_options: [],
    current_excepts: [],
    except_list: [],
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
    setExcepts ({commit}, excepts) {
      commit('SET_EXCEPTS', excepts)
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
      state.except_list = []
    },
    UPSERT_OPTION: (state, option) => {
      let options = state.custom_options
      if (option) {
        // options = options.filter(opt => opt.group_id !== option.group_id)
        options = options.filter(opt => opt.group !== option.group)
        options = [...options, option]
        state.custom_options = options
      }
    },
    SET_EXCEPTS: (state, excepts) => {
      let previousExcepts = state.current_excepts
      let exceptList = state.except_list
      // replace current excepts with new excepts
      state.current_excepts = excepts
      // remove previous excepts from exceptList
      previousExcepts.map(ex => {
        if (exceptList.indexOf(ex) >= 0) {
          exceptList.splice(exceptList.indexOf(ex), 1)
        }
      })
      // add new excepts into exceptList
      exceptList = exceptList.concat(excepts)
      console.log('except list: ', exceptList)
      state.except_list = exceptList
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
    },
    except_list (state) {
      return state.except_list
    }
  }
}

export default order
