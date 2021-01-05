import {getSpecialists} from '../../api/specialistApi'
// import auth from '../../libs/auth'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
  page: 1,
  pageSize: 10,
  total: 0,
  list: []
})

// getters
const getters = {
}

// actions
const actions = {

  changeUsername ({ commit }, name) {
    commit('changeUsername', name)
  },

  async getSpecialists ({ commit }, data) {
    const res = await getSpecialists(data)
    console.log('rewulibiao ->', res)
    if (res.success) {
      commit('specialistsList', res.data)
    }
  }
}

// mutations
const mutations = {
  changeUsername (state, name) {
    state.username = name
  },
  specialistsList (state, {page, pageSize, total, data}) {
    state.page = page
    state.pageSize = pageSize
    state.total = total
    state.list = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}