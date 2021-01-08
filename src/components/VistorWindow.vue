<template>
    <a-card :title="name" size="small">
        <div :id="'user_'+uid" class="video_container"></div>
    </a-card>
    
</template>

<script>
import auth from '../libs/auth'
export default {
    name: 'VistorWindow',
    props: {
        uid: Number,
        name: String
    },
    mounted() {
        const dom = document.querySelector(`#user_${this.uid}`)
        const rtcEngine = this.$sdk

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
    height: 230px;
    overflow: hidden;
}
</style>
