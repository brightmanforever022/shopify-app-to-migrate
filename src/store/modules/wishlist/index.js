import { initializeWishlist, getWishlist, addWishlist, removeWishlist } from '@/api/wishlist'

const wishlist = {
  namespaced: true,
  state: {
    wish_items: []
  },
  actions: {
    initWish ({commit}) {
      initializeWishlist()
      commit('SET_WISH', [])
      return []
    },
    get ({commit}) {
      var currentWishItems = getWishlist()
      commit('SET_WISH', currentWishItems)
      return currentWishItems
    },
		async addWish ({commit, dispatch, state}, wishData) {
      await dispatch('get')
      var wishDataWithID = wishData
      // Check if this data is in current wishilist
      var wishExists = false
      state.wish_items.map(wishItem => {
        if (wishItem.variant_id == wishDataWithID.variant_id && JSON.stringify(wishItem.custom_options) == JSON.stringify(wishDataWithID.custom_options)) {
          wishExists = true
        }
      })
      // Generate id and create new one for new wish data
      if (wishExists) {
        return state.wish_items
      } else {
        var d = new Date()
        wishDataWithID.wishId = d.getTime()
        var newWishItems = addWishlist(wishDataWithID)
        commit('SET_WISH', newWishItems)
        return newWishItems
      }
    },
    async addLineWish ({commit, dispatch, state}, wishData) {
      await dispatch('get')
      // Check if this data is in current wishlist
      var wishExists = false
      state.wish_items.map(wishItem => {
        if (wishItem.wishId == wishData.wishId) {
          wishExists = true
        }
      })
      // Create new one for new wish data
      if (wishExists) {
        return state.wish_items
      } else {
        var newWishItems = addWishlist(wishData)
        commit('SET_WISH', newWishItems)
        return newWishItems
      }
		},
		removeWish ({commit}, wishId) {
      var newWishItems = removeWishlist(wishId)
      commit('SET_WISH', newWishItems)
      return newWishItems
    }
  },
  mutations: {
    SET_WISH: (state, data) => {
			state.wish_items = data
		},
  },
  getters: {
    wish_length (state) {
      return state.wish_items.length
    },
    get_wish_items (state) {
      return state.wish_items
    },
    get_wish_id_list (state) {
      return state.wish_items.map(wishItem => { return wishItem.wishId })
    },
  }
}

export default wishlist
