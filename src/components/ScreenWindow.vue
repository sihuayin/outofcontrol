<template>
    <div :id="'user_'+uid" class="full_video_container"></div>
</template>

<script>
// import { SHARE_ID } from '../config/config'
export default {
    name: 'ScreenWindow',
    props: {
        uid: Number,
        role: String
    },
    mounted() {
        const dom = document.querySelector(`#user_${this.uid}`)
        const rtcEngine = this.$sdk
        if (this.role === 'localVideoSource') {
            dom && rtcEngine.client.setupLocalVideoSource(dom)
        } else {
            dom && rtcEngine.client.subscribe(this.uid, dom)

        }
        rtcEngine.client.setupViewContentMode('videosource', 1);
        rtcEngine.client.setupViewContentMode(String(this.uid), 1);
    },
    beforeDestroy() {
        this.role !== 'localVideoSource' && this.$sdk.client.muteRemoteVideoStream(parseInt(this.uid), true)
    }
}
</script>
<style>

.full_video_container{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
