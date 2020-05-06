const settings = {
  namespaced: true,
  state: {
    shipping_markup: 0,
  },
  actions: {
    setSettings ({commit}, data) {
      commit('SET_SETTINGS', data)
    },
  },
  mutations: {
    SET_SETTINGS: (state, data) => {
      if (data) {
        state.shipping_markup = data.shipping_markup
      }
    },
  },
  getters: {
    shipping_markup (state) {
      return state.shipping_markup
    },
  }
}

export default settings
