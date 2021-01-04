import {doLogin} from '../../api/loginApi'
import auth from '../../libs/auth'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
  username: '',
  pasaword: ''
})

// getters
const getters = {
}

// actions
const actions = {

  changeUsername ({ commit }, name) {
    commit('changeUsername', name)
  },

  async doLogin (state, body) {
    const data = await doLogin(body)
    if (data.success) {
      auth.login(data.data)
    }
    return data
  },

  doLogout () {
    auth.logout()
  }
}

// mutations
const mutations = {
  changeUsername (state, name) {
    state.username = name
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}