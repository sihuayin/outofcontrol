<template>
    <div></div>
</template>

<script>
export default {
    name: 'VistorWindow',
    props: {
        uid: Number
    },
    mounted() {
        const remoteVideoContainer = document.querySelector('#remote')
        const rtcEngine = this.$sdk
        rtcEngine.setupViewContentMode(this.uid, 1);
        rtcEngine.subscribe(this.uid, remoteVideoContainer)
    }
}
</script>