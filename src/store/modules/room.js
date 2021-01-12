// import {doLogin} from '../../api/loginApi'
import {videoJoin} from '../../api/specialistApi'
import {SHARE_ID} from '../../config/config'

const state = () => ({
  roomInfo: {
    id: 0,
    type: 'one'
  },
  members: [],
  hands: []
})

// getters
const getters = {
  specialist: (state) => {
    return state.members.find(m => m.roleId === 8)
  },
  vistor: (state) => {
    return state.members.find(m => m.roleId === 4 && m.rtc)
  },
  shareDisplayId: (state) => {
    const member = state.members.find(m => m.id > SHARE_ID)
    if (member && member.rtc) {
      return member.id
    }
    return 0
  }
}

// actions
const actions = {
  addHand({ commit }, member) {
    commit('addHand', member)
  },
  removeHand({ commit }, member) {
    commit('removeHand', member)
  },
  addMember ({ commit }, member) {
    commit('addMember', member)
  },


  joinVideo({ commit }, id) {
    commit('setRoomInfo', {})
    return videoJoin(id, {}).then((res) => {
      if (res.success) {
        const { members = [], room } = res.data
        members.forEach((member) => commit('addMember', member))

        commit('setRoomInfo', room)
      } else {
        throw (new Error(res.message))
      }
    })
  },

  setRoomInfo({ commit }, info) {
    commit('setRoomInfo', info)
  },

  clear({commit}) {
    commit('clear')
  }
}

// mutations
const mutations = {

    setRoomInfo (state, data) {
      state.roomInfo.id = data.id || state.roomInfo.id
      state.roomInfo.type = data.type || state.roomInfo.type
    },

    addMember(state, member) {
      if (member.roleid) {
        member.roleId = member.roleid
      }
      let mem = state.members.find(m => m.id === member.id)
      
      const data = Object.assign({
        id: 0,
        name: '',
        role: '',
        roleId: 0,
        rtc: false
      }, mem, member)
      console.log('查询', mem, data)
      if (mem) {
        for (let i in data) {
          mem[i] = data[i]
        }
      } else {
        state.members.push(data)
      }
    },
    addHand(state, member) {
      let mem = state.hands.find(h => h.id === member.id)
      if (!mem) {
        state.hands.push(member)
      }
    },
    removeHand(state, member) {
      state.hands = state.hands.filter(m => m.id !== member.id)
    },
    clear(state) {
      state.members = []
      state.roomInfo = {
        id: 0,
        type: 'one'
      }
      state.hands = []
    }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}