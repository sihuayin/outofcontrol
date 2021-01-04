<template>
  <a-layout class="main">
      <SecondHeader />
      <a-layout-content>
        <a-row type="flex" class="full-height">
          <a-col flex="auto" class="full-height">
            <a-card title="共享内容" class="full-height">
              <a-button slot="extra" type="primary" ghost>共享屏幕</a-button>
              <div :style="{width: '100%', height: '100%'}"></div>
            </a-card>
            
          </a-col>
          <a-col flex="300px">
             <a-card title="你好" size="small">
              <div :style="{width: '300px', height: '240px', background: 'red'}"></div>
            </a-card>
            <a-card title="你好" size="small">
              <div :style="{width: '300px', height: '240px', background: 'blue'}"></div>
            </a-card>
           
           
            
            
            
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
</template>
<script>
import SecondHeader from '../components/SecondHeader'
import Rtm from '../libs/rtm'
import config from '../config/config'
import auth from '../libs/auth'
export default {
  name: 'TestPage',
  components: {
    SecondHeader
  },
  async mounted () {
    const channelName = 'channeltest1'
    const userId = '' + 10
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
        console.log('消息来了 start -> ', message)
        const msgData = JSON.parse(message.text)
        if (msgData.type === 'hello') {
          console.log('消息来了 Hello -> ', msgData.data)
          this.addMemember(msgData.data)
          // if (msgData.data && msgData.data.role === 'zhuanjia') {
          //   this.setSpecialist(msgData.data)
          // } else if (msgData.data && msgData.data.role === 'yisheng') {
          //   this.setVistor(msgData.data)
          // }
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
    try {
      await this.rtm.join(channel, bus, {
        channelName
      })
      const count = await this.rtm.client.getChannelMemberCount([channelName])
      console.log('频道人数,', count)
      // todo 发送我是谁的通知
      const message = {
        type: 'hello',
        data: {
          id: 1,
          name: 'test',
          role: 'yisheng'
        }
      }
      this.rtm.sendChannelMessage(channelName, {
        text: JSON.stringify(message)
      }, {})
    } catch(e) {
      console.log('rmt join error: ', e)
    }
    
  }
}
</script>

<style>
.full-height {
  height: 100%;
}
</style>

