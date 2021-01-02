<template>
  <div :id="'share_' + uid"></div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'SharePanel',
  props: ['uid'],
  computed: {
    ...mapState({
      shareDisplayId: state => state.room.shareDisplayId
    })
  },
  mounted() {
    this.$nextTick(() => {
      // const params = {
      //   channel: 'demoChannel',
      //   uid: 1,
      //   token: null
      // }
      // console.log('display -> ', this.shareDisplayId, params)
      // this.$sdk.startScreenShare({
      //   displayId: this.shareDisplayId,
      //   params
      // })
    })
  }
}
</script>
