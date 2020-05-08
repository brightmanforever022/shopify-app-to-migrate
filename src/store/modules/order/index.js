import { createOrder, createQuote } from '@/api/order'

const order = {
  namespaced: true,
  state: {
    quantity: 1,
    variant_id: null,
    custom_options: [],
    current_excepts: [],
    except_list: [],
    saved: false,
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
    setSaved({commit}) {
      commit('SET_SAVED')
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
    },
    async createQuote ({ commit, state, getters }, contactData) {
      try {
        console.log('contact data: ', contactData)
        const newQuote = await createQuote({ quoteDetail: state.custom_options, contactDetail: contactData, variantId: state.variant_id, quantity: state.quantity })
        return newQuote.data
      } catch (error) {
        console.log('error generated when creating new quote')
      }
    },
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
    SET_SAVED: (state) => {
      state.saved = true
    },
    UPSERT_OPTION: (state, option) => {
      let options = state.custom_options
      if (option) {
        // here option.group is the label of group
        options = options.filter(opt => opt.group !== option.group)
        options = [...options, option]
        state.custom_options = options
      }
    },
    SET_EXCEPTS: (state, excepts) => {
      let removedExceptList = state.except_list.filter(ex => ex.groupId != excepts.groupId)
      let newExceptList = removedExceptList.concat(excepts.exceptData)
      // check if options includes except list
      let options = state.custom_options
      options = options.filter(opt => !excepts.groupLabelList.includes(opt.group))
      state.custom_options = options
      state.except_list = newExceptList
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
      return state.except_list.map(ex => ex.exceptId)
    },
    is_saved (state) {
      return state.saved
    }
  }
}

export default order
