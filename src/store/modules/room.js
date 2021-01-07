// import {doLogin} from '../../api/loginApi'
import {videoJoin} from '../../api/specialistApi'


const state = () => ({
  roomInfo: {
    id: 0,
    type: 'one'
  },
  shareDisplayId: 0,
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

  setDisplayInfo({ commit }, info) {
    commit('setDisplayInfo', info)
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
    setDisplayInfo(state, info) {
      state.shareDisplayId = info
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
      let mem = state.members.find(m => m.id === member.id)
      if (!mem) {
        state.members.push(member)
      }
    },
    removeHand(state, member) {
      state.members.filter(m => m.id !== member.id)
    },
    clear(state) {
      state.members = []
      state.roomInfo = {
        id: 0,
        type: 'one'
      }
      state.shareDisplayId = 0
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