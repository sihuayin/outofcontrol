<template>

<a-layout class="main">
      <SecondHeader />
      <a-layout-content>
        <a-row type="flex" class="full-height">
          <a-col flex="auto" class="full-height">

            <a-card title="共享内容" class="full-height">
              <template v-if="canIShare">
                <a-button @click="prepareShare" slot="extra" type="primary" ghost v-if="!shareDisplayId">共享屏幕</a-button>
                <a-button @click="stopShare" slot="extra" type="danger" ghost v-else>停止共享</a-button>
              </template>
              <a-modal
                title="共享内容"
                width="100%"
                :visible="shareDisplayId > 0"
                :closable="false"
              >
              <template slot="footer">
                <a-button @click="stopShare">
                  关闭
                </a-button>
              </template>
              <ScreenWindow v-if="shareDisplayId > 0" :uid="shareDisplayId" :role="localShare ? 'localVideoSource' : 'remoteVideoSource'"/>
              </a-modal>
              
            </a-card>
            
          </a-col>
          <a-col flex="300px">
            <VistorWindow v-if="specialist && specialist.rtc" :uid="specialist.id" :name="specialist.name" />
            <a-card title="专家" size="small" v-else>
              <div :style="{width: '300px',  height: '230px', overflow: 'hidden'}">未加入</div>
            </a-card>
            <VistorWindow v-if="vistor && vistor.rtc" :uid="vistor.id" :name="vistor.name" />
            
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
import ScreenWindow from '../components/ScreenWindow'
import { mapState, mapActions, mapGetters } from 'vuex'
import auth from '../libs/auth'
import Rtm from '../libs/rtm'
import config, { SHARE_ID } from '../config/config'
// import path from 'path'
// import os from 'os'

export default {
  name: 'App',
  components: {
    ShareWindow,
    SecondHeader,
    VistorWindow,
    ScreenWindow
  },
  data () {
    return {
      items: [],
      visible: false,
      localVideoSource: 0,
      channelName: '',
      localShare: false,
      sharePanel: false,
      bus: null
    }
  },
  computed: {
    ...mapState({
      roomInfo: state => state.room.roomInfo,
      members: state => state.room.members
    }),
    ...mapGetters('room', {
      specialist: 'specialist',
      vistor: 'vistor',
      shareDisplayId: 'shareDisplayId'
    }),
    canHandUp() {
      console.log('参与值对比', this.specialist, this.roomInfo)
      return !this.vistor && this.roomInfo.type === 'some'
    },
    canIShare() {
      if (this.roomInfo.type === 'one') {
        return true
      } else if (this.roomInfo.type === 'some' && this.vistor && this.vistor.id === auth.id) {
        return true
      }
      return false
    }
  },
  async mounted () {
    this.channelName = 'channel' + this.roomInfo.id
    const userId = '' + auth.id
    this.rtm = new Rtm()
    await this.rtm.init({
      appId: config.appID,
      uploadLog: './rtm.txt',
      uid: userId,
      channelName: this.channelName
    })

    const [channel, bus] = this.rtm.createObserverChannel(this.channelName)
    this.bus = bus

    bus.on('ChannelMessage', ({
            message
        }) => {
      try {
        console.log('消息来了 start -> ', message)
        const msgData = JSON.parse(message.text)
        if (msgData.type === 'hello') {
          console.log('消息来了 Hello -> ', msgData.data)
          this.addMember(msgData.data)
        }  else if (msgData.type === 'selectOne') {
          if (msgData.data && msgData.data.id !== undefined) {
            if (auth.isYisheng() && auth.id === msgData.data.id) { // 选中的人是我
              // todo 切换角色加入频道直播
              this.$sdk.publish()
            } else if (auth.isYisheng() && auth.id !== msgData.data.id) {
              this.$sdk.unpublish()
            }
          }
        }
      } catch(e) {
        console.log(e)
      }
    })
    try {
      await this.rtm.join(channel, bus, {
        channelName: this.channelName
      })
    } catch(e) {
      console.log('rmt join error: ', e)
    }

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
    setTimeout(() => {
      console.log('发送消息', message)
      this.rtm.sendChannelMessage(this.channelName, {
        messageType: 'TEXT',
        text: JSON.stringify(message)
      }, {})
    }, 20)
    // let ret = await this.rtm.sendChannelMessage(channelName, {
    //   messageType: 'TEXT',
    //   text: JSON.stringify(message)
    // }, {})
    // console.log('发送消息', ret)

    this.$nextTick(() => {
      let rtcEngine = this.$sdk
      const role = this.roomInfo.type === 'one' ? 1 : 2

      rtcEngine.client.setClientRole(role)
      // rtcEngine.client.setChannelProfile(1)

      rtcEngine.on('error', (err, msg) => {
        console.log('console.log', err, msg)
      })

      rtcEngine.on('user-published', ({uid}) => {
        this.addMember({
          id: uid,
          rtc: true
        })
      })

      rtcEngine.on('user-unpublished', ({uid}) => {
        if (this.localShare && uid > SHARE_ID) {
          return
        }
        this.removeMember({
          id: uid
        })

      })

      rtcEngine.on('joined-channel', ({ uid }) => {
        if (parseInt(uid) === parseInt(auth.id)) {
          if (this.roomInfo.type === 'one') {
            this.addMember({
              id: uid,
              rtc: true
            })
          }
        }

      })
      
      rtcEngine.on('role-changed', ({ oldRole, newRole }) => {
        console.log('角色变化, ', oldRole, newRole )
        let data
        if (newRole === 1) {
          data = {
            id: auth.id,
            rtc: true,
            name: auth.name
          }
        } else {
          data = {
            id: 0,
            rtc: false,
            name: ''
          }
        }
        this.addMember(data)
      })

      rtcEngine.join(null, this.channelName, null, auth.id)
      global.rtcEngine = rtcEngine
    })
  },
  beforeDestroy() {
    if (this.bus) {
      this.bus.removeAllListeners()
    }
    this.$sdk.leave()
    this.rtm.destroyRtm()
    this.clear()

    this.$sdk.stopScreenShare()
  },
  methods: {
    ...mapActions('room', [
      'addMember',
      'clear',
      'removeMember'
    ]),
    prepareShare () {
      if (this.shareDisplayId > 0) {
        this.$message.info('正在共享目录')
        return
      }
      this.visible = true
      this.$sdk.getShareWindows().then(arr => {
        console.log('windows',arr)
        this.items = arr
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    async chooseDisplay(windowId) {
      console.log('开始', windowId)
      try {
        this.localShare = true
        const uid = await this.$sdk.prepareScreenShare(null, this.channelName, '')
        await this.$sdk.startScreenShare(windowId)
        if (!this.shareDisplayId) {
          this.addMember({
            id: uid,
            rtc: true
          })
        }
        this.visible = false
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    async stopShare() {
      if (this.localShare) {
        this.localShare = false
        await this.$sdk.stopScreenShare()
        if (this.shareDisplayId) {
          this.removeMember({
            id: this.shareDisplayId
          })
        }
      }
    },
    handUp() {
      const message = {
        type: 'handUp',
        data: {
          id: auth.id,
          name: auth.name
        }
      }
      this.rtm.sendChannelMessage(this.channelName, {
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
