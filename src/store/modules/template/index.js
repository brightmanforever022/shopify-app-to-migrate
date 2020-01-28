const template = {
  namespaced: true,
  state: {
    templates: []
  },
  actions: {
    set_templates ({commit}, data) {
      commit('SET_TEMPLATES', data)
    }
  },
  mutations: {
    SET_TEMPLATES: (state, data) => {
      if (data) {
        state.templates = data
      }
    }
  },
  getters: {
    get_templates (state) {
      return state.templates
    },
    template_by_variant: (state) => variant_id => {
      let template = {
        groups: []
      }
      state.templates.forEach(t => {
        let variant = t.variants.find(v => v.shopify_variant_id === +variant_id)
        if (variant) {
          template = t
        }
      })
      console.log('variant id: ', variant_id)
      console.log('template data: ', template)
      // return template
      return state.templates[0]
    },
    group_by_id: (state) => id => {
      let group = {}
      state.templates.forEach(g => {
        let grp = g.groups.find(g => g.id === +id)
        if (grp) {
          group = grp
        }
      })
      return group
    }
  }
}

export default template
