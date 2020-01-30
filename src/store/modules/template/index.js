const template = {
  namespaced: true,
  state: {
    template: {}
  },
  actions: {
    set_template ({commit}, data) {
      commit('SET_TEMPLATE', data)
    }
  },
  mutations: {
    SET_TEMPLATE: (state, data) => {
      if (data) {
        state.template = data
      }
    }
  },
  getters: {
    get_template: (state) => {
      // let template = {
      //   groups: []
      // }
      // state.templates.forEach(t => {
      //   let variant = t.variants.find(v => v.shopify_variant_id === +variant_id)
      //   if (variant) {
      //     template = t
      //   }
      // })
      // return template
      console.log('template data: ', state.template)
      return state.template
    },
    group_by_id: (state) => id => {
      let group = {}
      let grp = state.template.groups.find(g => g.id === +id)
      if (grp) {
        group = grp
      }
      return group
    }
  }
}

export default template
