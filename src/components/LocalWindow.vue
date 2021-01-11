<template>
  <div id="user_local" class="video_container"></div>
</template>

<script>
export default {
    name: 'LocalWindow',
    props: {
        uid: Number,
        name: String
    },
    mounted() {
        const dom = document.querySelector(`#user_local`)
        const rtcEngine = this.$sdk
        const list = rtcEngine.client.getVideoDevices()
        console.log(list)
        rtcEngine.client.enableVideo()
        dom && rtcEngine.client.setupLocalVideo(dom)
        rtcEngine.client.setClientRole(1)
        rtcEngine.client.startPreview()
        // console.log('ret', ret, dom)rtcEngine.client.setupViewContentMode(this.uid, 0)
    },
    beforeDestroy() {
      console.log('destry testing camera')
      const rtcEngine = this.$sdk
      rtcEngine.client.setClientRole(2)
      rtcEngine.client.stopPreview()
    }
}
</script>
<style>
.video_container{
    width: 300px;
    height: 230px;
    overflow: hidden;
}
</style>
