import {getDocterDatings} from '../../api/docterApi'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
  datings: [],
  datingPage: 1,
  datingTotal: 0,
  datingPageSize: 10,
  datingLoading: false
})

// getters
const getters = {
}

// actions
const actions = {
  async getDocterDatings ({ commit }) {
    const data = await getDocterDatings({})
    console.log('dating', data)
    if (data.success) {
      commit('docterDatings', data.data)
    }
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}