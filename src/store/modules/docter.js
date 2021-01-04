import {getDocterDatings, addDocterDating} from '../../api/docterApi'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
  datings: [],
  datingPage: 1,
  datingTotal: 0,
  datingPageSize: 10,
  datingLoading: false,

  addDating: false
})

// getters
const getters = {
}

// actions
const actions = {
  async getDocterDatings ({ commit }, { page, pageSize = 10, type}) {
    const data = await getDocterDatings({page, pageSize, type})
    console.log('dating', data)
    if (data.success) {
      commit('docterDatings', data.data)
    }
  },
  async addDocterDating({ commit }, data) {
    commit('setAddDating', true)
    const result = await addDocterDating(data)
    if (result.success) {
      commit('setAddDating', false)
      return ''
    }
    commit('setAddDating', false)
    return result.message
  }
}

// mutations
const mutations = {
  docterDatings (state, data) {
    state.datings = data.data;
    state.datingPage = data.page;
    state.datingTotal = data.total;
    state.datingPageSize = data.pageSize;
    state.datingLoading = false
  },
  setAddDating (state, isAdding) {
    state.addDating = isAdding
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}