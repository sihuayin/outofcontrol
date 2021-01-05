<template>

<a-layout class="main">
      <SecondHeader />
      <a-layout-content>
        <a-row type="flex" class="full-height">
          <a-col flex="auto" class="full-height">

            <a-card title="共享内容" class="full-height">
              <a-button @click="prepareShare" slot="extra" type="primary" ghost v-if="!shareDisplayId">共享屏幕</a-button>
              <a-button @click="stopShare" slot="extra" type="danger" ghost v-else>停止共享</a-button>
              <VistorWindow v-if="shareDisplayId" :uid="shareDisplayId" role="localVideoSource"/>
              <div v-else :style="{width: '100%', height: '100%'}"></div>
            </a-card>
            
          </a-col>
          <a-col flex="300px">
            <VistorWindow v-if="specialist && specialist.rtc" :uid="specialist.id" :name="specialist.name" />
            <a-card title="专家" size="small" v-else>
              <div :style="{width: '300px',  height: '230px', overflow: 'hidden'}">未加入</div>
            </a-card>
            <VistorWindow v-if="vistor && vistor.rtc" :uid="vistor.id" :name="vistor.name" />
            
            <Hands v-if="showHands" :hands="hands"/>
            <a-modal v-model="visible" title="共享屏幕" @ok="visible=false">
              <ShareWindow :items="items" @display="chooseDisplay" />
            </a-modal>
            
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
</template>

<script>
import SecondHeader from '../components/SecondHeader'
import ShareWindow from '../components/ShareWindow'
// import SharePanel from '../components/SharePanel'
import VistorWindow from '../components/VistorWindow'
import Hands from '../components/Hands'
import { mapState, mapActions, mapGetters } from 'vuex'
import auth from '../libs/auth'
import Rtm from '../libs/rtm'
import config from '../config/config'
// import path from 'path'
// import os from 'os'

export default {
  name: 'App',
  components: {
    ShareWindow,
    SecondHeader,
    VistorWindow,
    Hands
  },
  data () {
    return {
      items: [],
      visible: false,
      localVideoSource: 0,
      bus: null,
      channelName: '',
    }
  },
  computed: {
    ...mapState({
      hands: state => state.room.hands,
      roomInfo: state => state.room.roomInfo,
      shareDisplayId: state => state.room.shareDisplayId
    }),
    ...mapGetters('room', {
      specialist: 'specialist',
      vistor: 'vistor'
    }),
    showHands() {
      return !this.vistor
    }
  },
  async mounted () {
    const channelName = 'channel' + this.roomInfo.id
    this.channelName = channelName
    const userId = '' + auth.id
    this.rtm = new Rtm()
    await this.rtm.init({
      appId: config.appID,
      uploadLog: './rtm.txt',
      uid: userId,
      channelName
    })

    const [channel, bus] = this.rtm.createObserverChannel(channelName)
    this.bus = bus

    bus.on('ChannelMessage', ({
            message
        }) => {
      try {
        const msgData = JSON.parse(message.text)
        if (msgData.type === 'hello') {
          this.addMemember(msgData.data)
        } else if (msgData.type === 'handUp') { // 接收到举手信息
          if (msgData.data && msgData.data.id) {
            if (auth.isZhuanjia()) {
              // todo 添加到举手列表
              this.addHand({
                id: msgData.data.id
              })
            }
          }
        }
      } catch(e) {
        console.log(e)
      }
    })
    await this.rtm.join(channel, bus, {
      channelName
    })


    // todo 发送我是谁的通知
    const message = {
      type: 'hello',
      data: {
        id: auth.id,
        name: auth.name,
        role: auth.role,
        roleId: auth.roleId
      }
    }
    await this.rtm.sendChannelMessage(channelName, {
      messageType: 'TEXT',
      text: JSON.stringify(message)
    }, {})

    this.$nextTick(() => {
      let rtcEngine = this.$sdk
      const role = 1
      rtcEngine.client.setClientRole(role)
      // rtcEngine.client.setChannelProfile(1)

      rtcEngine.on('error', (err, msg) => {
        console.log('console.log', err, msg)
      })

      rtcEngine.on('user-published', (uid) => {
         this.addMemember({
          id: uid,
          rtc: true
        })
      })

      rtcEngine.on('user-unpublished', (uid) => {
          this.addMemember({
            id: uid,
            rtc: false
          })
      })

      rtcEngine.on('joined-channel', ({ uid }) => {
        if (parseInt(uid) === parseInt(auth.id)) {
          this.addMemember({
            id: uid,
            rtc: true
          })
        }

      })

      rtcEngine.join(null, channelName, null, auth.id)
      global.rtcEngine = rtcEngine
    })
  },
  beforeDestroy() {
    if (this.bus) {
      this.bus.removeAllListeners()
    }
    this.$sdk.release()
    this.rtm.destroyRtm()
  },
  methods: {
    ...mapActions('room', [
      'addMember',
      'setDisplayInfo',
      'addHand'
    ]),
    prepareShare () {
      this.visible = true
      this.$sdk.getShareWindows().then(arr => {
        console.log(arr)
        this.items = arr
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    chooseDisplay(windowId) {
      console.log('开始', windowId)
      this.$sdk.prepareScreenShare(null, this.channelName, '')
      .then(uid => {
        console.log('准备完成', uid, windowId)
        this.$sdk.startScreenShare(windowId)
        this.setDisplayInfo(uid)
        this.visible = false
      })
      .catch(err => {
        console.log(err)
      })
    },
    stopShare() {
      this.$sdk.stopScreenShare()
      this.setDisplayInfo(0)
    }
  }
}
</script>

<style>
.board-container {
  flex: 1;
  background-color: blanchedalmond;
}
.full-height {
  height: 100%;
}
</style>
