<template>
    <div :id="'user_'+uid" class="video_container"></div>
</template>

<script>
import auth from '../libs/auth'
import { SHARE_ID } from '../config/config'
export default {
    name: 'VistorWindow',
    props: {
        uid: Number,
        role: String
    },
    mounted() {
        const dom = document.querySelector(`#user_${this.uid}`)
        const rtcEngine = this.$sdk
        if (this.role === 'localVideoSource') {
            dom && rtcEngine.client.setupLocalVideoSource(dom)
            rtcEngine.client.setupViewContentMode('videosource', 1);
            rtcEngine.client.setupViewContentMode(String(SHARE_ID), 1);
            return 
        } 

        if (this.uid === auth.id) {
            console.log('渲染本地', this.uid, auth.id)
            rtcEngine.client.setupLocalVideo(dom)
            rtcEngine.client.setupViewContentMode(this.uid, 0)
        } else {
            console.log('渲染远程', this.uid, auth.id)
            rtcEngine.client.setupViewContentMode(this.uid, 0)
            rtcEngine.client.subscribe(this.uid, dom)
        }
    }
}
</script>
<style>
.video_container{
    width: 300px;
    height: 300px;
    overflow: hidden;
}
</style>
