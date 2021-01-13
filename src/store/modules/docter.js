import {getDocterDatings, addDocterDating, getDocterLessons} from '../../api/docterApi'
import moment from 'moment'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
  datings: [],
  datingPage: 1,
  datingTotal: 0,
  datingPageSize: 10,
  datingLoading: false,

  addDating: false,

  lessons: [],
  lessonPage: 1,
  lessonPageSize: 10,
  lessonTotal: 0,
  lessonLoading: false
})

// getters
const getters = {
  unfinshed: state => state.datings.filter(d => moment()< moment(d.enddttm))
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
  },
  async getDocterLesson({ commit }, { page, pageSize = 10}) {
    this.lessonLoading = true
    try {
      const data = await getDocterLessons({page, pageSize})

      if (data.success) {
        commit('docterLessons', data.data)
      }
    } catch(e) {
      this.lessonLoading = false
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
  },
  setAddDating (state, isAdding) {
    state.addDating = isAdding
  },
  docterLessons (state, data) {
    state.lessons = data.data;
    state.lessonPage = data.page;
    state.lessonTotal = data.total;
    state.lessonPageSize = data.pageSize;
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