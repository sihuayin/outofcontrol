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
  shareDisplayId: 0,
  members: []
})

// getters
const getters = {
}

// actions
const actions = {
  addMemember ({ commit }, member) {
    commit('addMemember', member)
  },

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
            commit('addMemember', member)
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
      state.roomInfo.id = data.id || state.roomInfo.id
      state.roomInfo.type = data.type || state.roomInfo.type
    },
    setDisplayInfo(state, info) {
      state.shareDisplayId = info
    },
    addMemember(state, member) {
      let mem = state.members.find(m => m.id === member.id)
      const data = Object.assign({
        id: 0,
        name: '',
        role: ''
      }, member)
      if (mem) {
        mem = data
      } else {
        state.members.push(data)
      }
    }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}