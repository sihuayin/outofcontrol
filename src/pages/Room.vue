<template>
  <a-layout class="main">
      <a-layout-header>
        <button @click="goBack">返回</button>
      </a-layout-header>
      <a-layout-content>
        <a-row type="flex">
          <a-col :flex="1">
            <button @click="prepareShare">共享屏幕</button>
          </a-col>
          <a-col :flex="3">
            <div id="console"></div>
            <div id="remote"></div>
            <div id="local"></div>
            <ShareWindow :items="items" />
          </a-col>
        </a-row>
      </a-layout-content>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
</template>

<script>
import ShareWindow from '../components/ShareWindow'
// import path from 'path'
// import os from 'os'

export default {
  name: 'App',
  components: {
    ShareWindow
  },
  data () {
    return {
      items: []
    }
  },
  created() {
    console.log('route', this.$router)
  },
  mounted () {
    this.$nextTick(() => {
      const consoleContainer = document.querySelector('#console')
      let rtcEngine = this.$sdk
      // rtcEngine.initialize(appid)
      // // listen to events
      rtcEngine.on('joined-channel', (channel, uid, elapsed) => {
        console.log('yes recived')
          consoleContainer.innerHTML = `join channel success ${channel} ${uid} ${elapsed}`
          let localVideoContainer = document.querySelector('#local')
          //setup render area for local user
          rtcEngine.client.setupLocalVideo(localVideoContainer)
      })

      // rtcEngine.on('error', (err, msg) => {
      //   console.log('console.log', err, msg)
      // })

      // rtcEngine.on('user-published', (uid) => {
      //   //setup render area for joined user
      //   let remoteVideoContainer = document.querySelector('#remote')
      //   rtcEngine.setupViewContentMode(uid, 1);
      //   rtcEngine.subscribe(uid, remoteVideoContainer)
      // })

      // rtcEngine.setChannelProfile(1)
      // rtcEngine.setClientRole(1)
      // rtcEngine.enableVideo()
      // const logpath = path.join(os.homedir(), 'agorasdk.log')
      // console.log('logpath -> ', logpath)
      // rtcEngine.setLogFile(logpath)

      rtcEngine.join(null, "demoChannel", null, Math.floor(new Date().getTime() / 1000))
      global.rtcEngine = rtcEngine
    })
  },
  beforeDestroy() {
    this.$sdk.release()
  },
  methods: {
    prepareShare () {
      this.$sdk.prepareScreenShare().then(arr => {
        console.log(arr)
        this.items = arr
      })
    },
    goBack() {
      this.$router.go(-1)
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
