// import {doLogin} from '../../api/loginApi'
import {videoJoin} from '../../api/specialistApi'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
  specialist: {
      id: 0,
      name: '',
      role: '',
      rtc: false
  },
  vistor: {
      id: 0,
      name: '',
      role: '',
      rtc: false
  },
  roomInfo: {
    id: 0,
    type: 'one'
  },
  shareDisplayId: 0
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
  },

  joinVideo({ commit }, id) {
    commit('setRoomInfo', {})
    return videoJoin(id, {}).then((res) => {
      if (res.success) {
        const { members = [], room } = res.data
        members.forEach((member) => {
          if (member.role === 'zhuanjia') {
            commit('specialist', member)
          } else {
            commit('setVistor', member)
          }
        })

        commit('setRoomInfo', room)
      } else {
        throw (new Error(res.message))
      }
    })
  },

  setRoomInfo({ commit }, info) {
    commit('setRoomInfo', info)
  },

  setDisplayInfo({ commit }, info) {
    commit('setDisplayInfo', info)
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
        state.vistor.role = data.role || state.vistor.role
        state.vistor.rtc = data.rtc === undefined ? state.vistor.rtc : data.rtc
    },
    setRoomInfo (state, data) {
      state.roomInfo = data
    },
    setDisplayInfo(state, info) {
      state.shareDisplayId = info
    }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}