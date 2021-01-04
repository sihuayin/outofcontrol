import { mapActions } from 'vuex'
import auth from '../libs/auth'
export default {
  methods: {
    ...mapActions('room', [
      'joinVideo'
    ]),
    async goLive(id) {
      try {
        await this.joinVideo(id)
        if (auth.role !== 'zhuanjia') {
          this.$router.push(`/room/${id}`)
        } else {
          this.$router.push(`/zhuanjia_room/${id}`)
        }
      } catch(e) {
        this.$message.error(e.message)
      }
    },
  }
}