<template>
  <a-layout class="main">
      <a-layout-header>
        <button @click="goBack">返回</button>
      </a-layout-header>
      <a-layout-content>
        <a-row type="flex">
          <a-col :flex="3">
            <button @click="prepareShare">共享屏幕</button>
  
          <VistorWindow v-if="shareDisplayId" :uid="shareDisplayId" role="localVideoSource"/>
          </a-col>
          <a-col :flex="1">
            <VistorWindow v-if="vistor.id && vistor.rtc" :uid="vistor.id" />
            <VistorWindow v-if="specialist.id && specialist.rtc" :uid="specialist.id" />
            <a-modal v-model="visible" title="共享屏幕" @ok="visible=false">
              <ShareWindow :items="items" @display="chooseDisplay" />
            </a-modal>
            
            
          </a-col>
        </a-row>
      </a-layout-content>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
</template>

<script>
import ShareWindow from '../components/ShareWindow'
// import SharePanel from '../components/SharePanel'
import VistorWindow from '../components/VistorWindow'
import { mapState, mapActions } from 'vuex'
import auth from '../libs/auth'
import Rtm from '../libs/rtm'
import config from '../config/config'
// import path from 'path'
// import os from 'os'

export default {
  name: 'App',
  components: {
    ShareWindow,
    VistorWindow
  },
  data () {
    return {
      items: [],
      visible: false,
      localVideoSource: 0,
      bus: null
    }
  },
  computed: {
    ...mapState({
      vistor: state => state.room.vistor,
      specialist: state => state.room.specialist,
      roomInfo: state => state.room.roomInfo,
      shareDisplayId: state => state.room.shareDisplayId
    })
  },
  async mounted () {
    const channelName = 'channel' + this.roomInfo.id
    const userId = '' + auth.id
    this.rtm = new Rtm()
    await this.rtm.init({
      appId: config.appID,
      uploadLog: './rtm.txt',
      uid: userId,
      channelName
    })

    const [channel, bus] = this.rtm.createObserverChannel('demoChannel')
    this.bus = bus

    bus.on('ChannelMessage', ({
            message
        }) => {
      try {
        const msgData = JSON.parse(message.text)
        if (msgData.type === 'hello') {
          if (msgData.data && msgData.data.role === 'zhuanjia') {
            this.setSpecialist(msgData.data)
          } else if (msgData.data && msgData.data.role === 'yisheng') {
            this.setVistor(msgData.data)
          }
        }
      } catch(e) {
        console.log(e)
      }
    })
    await this.rtm.join(channel, bus, {
      channelName: 'demoChannel'
    })


    // todo 发送我是谁的通知
    const message = {
      type: 'hello',
      data: {
        id: 1,
        name: 'test',
        role: 'yisheng'
      }
    }
    await this.rtm.sendChannelMessage('demoChannel', {
      messageType: 'TEXT',
      text: JSON.stringify(message)
    }, {})

    this.$nextTick(() => {
      let rtcEngine = this.$sdk
      const role = auth.role === 'zhuanjia' || this.roomInfo.type === 'one' ? 1 : 2
      console.log('身份', role)
      rtcEngine.client.setClientRole(role)
      // rtcEngine.client.setChannelProfile(1)

      rtcEngine.on('error', (err, msg) => {
        console.log('console.log', err, msg)
      })

      rtcEngine.on('user-published', (uid) => {
        this.setVistor({
          id: uid,
          rtc: true
        })

      })

      rtcEngine.on('user-unpublished', () => {
          this.setVistor({
            id: 0,
            rtc: false
          })
      })

      rtcEngine.on('joined-channel', ({ uid }) => {
        if (parseInt(uid) === parseInt(auth.id)) {
          if (auth.role === 'zhuanjia') {
            this.setSpecialist({
              id: uid,
              rtc: true
            })
          } else {
            this.setVistor({
              id: uid,
              rtc: true
            })
          }
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
  },
  methods: {
    ...mapActions('room', [
      'setVistor',
      'setSpecialist',
      'setDisplayInfo'
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
      this.$sdk.prepareScreenShare(null, 'demoChannel', '')
      .then(uid => {
        console.log('准备完成', uid, windowId)
        this.$sdk.startScreenShare(windowId)
        this.setDisplayInfo(uid)
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style>
.board-container {
  flex: 1;
  background-color: blanchedalmond;
}
</style>
