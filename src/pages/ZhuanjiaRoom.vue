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
            <VistorWindow v-if="specialist.id && specialist.rtc" :uid="specialist.id" :name="specialist.name" />
            <VistorWindow v-if="vistor.id && vistor.rtc" :uid="vistor.id" :name="vistor.name" />
            
            <a-card title="参与" size="small" v-if="canHandUp">
              <a-button @click="handUp" type="primary" ghost><a-icon type="video-camera" />举手</a-button>
            </a-card>
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
    SecondHeader,
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
    }),
    canHandUp() {
      console.log('参与值对比', this.specialist, this.roomInfo)
      return !this.vistor.id && this.roomInfo.type === 'some' && auth.role === 'yisheng'
    }
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

    const [channel, bus] = this.rtm.createObserverChannel(channelName)
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
        } else if (msgData.type === 'handUp') { // 接收到举手信息
          if (msgData.data && msgData.data.id) {
            if (auth.role === 'zhuanjia') {
              // todo 添加到举手列表
            }
          }
        } else if (msgData.type === 'selectOne') {
          if (msgData.data && msgData.data.id !== undefined) {
            if (auth.role === 'yisheng' && auth.id === msgData.data.id) { // 选中的人是我
              // todo 切换角色加入频道直播
              this.$sdk.publish()
            } else if (auth.role === 'yisheng' && auth.id !== msgData.data.id) {
              this.$sdk.unpublish()
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
        id: 1,
        name: 'test',
        role: 'yisheng'
      }
    }
    await this.rtm.sendChannelMessage(channelName, {
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
        this.visible = false
      })
      .catch(err => {
        console.log(err)
      })
    },
    stopShare() {
      this.$sdk.stopScreenShare()
      this.setDisplayInfo(0)
    },
    handUp() {
      const message = {
        type: 'handUp',
        data: {
          id: 1
        }
      }
      this.rtm.sendChannelMessage('demoChannel', {
        messageType: 'TEXT',
        text: JSON.stringify(message)
      }, {})
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
