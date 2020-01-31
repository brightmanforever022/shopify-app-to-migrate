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
        // here option.group is the label of group
        options = options.filter(opt => opt.group !== option.group)
        options = [...options, option]
        state.custom_options = options
      }
    },
    SET_EXCEPTS: (state, excepts) => {
      let exceptList = state.except_list
      let newExceptList = []
      // remove excepts related new exceptGroupId from exceptList
      if (excepts.length > 0) {
        const newExceptGroupId = excepts[0].groupId
        exceptList.map(ex => {
          if (ex.groupId != newExceptGroupId) {
            newExceptList.push(ex)
          }
        })
      } else {
        newExceptList = exceptList
      }
      // add new excepts into exceptList
      exceptList = newExceptList.concat(excepts)
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
      return state.except_list.map(ex => ex.exceptId)
    }
  }
}

export default order
