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
      return state.template
    },
    group_by_id: (state) => id => {
      let group = {}
      let grp = state.template.groups.find(g => g.id === +id)
      if (grp) {
        group = grp
      }
      return group
    },
    group_label_list: (state) => excepts => {
      if(excepts == '') {
        return []
      } else {
        let exceptAttributeList = excepts.split(',')
        let currentGroups = state.template.groups
        let exceptsGroupList = []
        currentGroups.map(gr => {
          gr.dattributes.map(da => {
            if (exceptAttributeList.includes(da.id.toString())) {
              exceptsGroupList.push(gr.label)
            }
          })
        })
        return exceptsGroupList.filter((v, i, a) => a.indexOf(v) === i)
      }
    },
  }
}

export default template
