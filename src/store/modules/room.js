// import {doLogin} from '../../api/loginApi'


// initial state
// shape: [{ id, quantity }]
const state = () => ({
    specialist: {
        id: 0,
        name: ''
    },
    vistor: {
        id: 0,
        name: ''
    }
})

// getters
const getters = {
}

// actions
const actions = {

  setSpecialist ({ commit }, data) {
    commit('specialist', data)
  },

  setVistor({ commit }, user) {
    commit('setVistor', user)
  }
}

// mutations
const mutations = {
    specialist (state, data) {
        state.specialist = data
    },
    setVistor (state, data) {
        state.vistor.id = data.id || state.vistor.id
        state.vistor.name = data.name || state.vistor.name
    }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}