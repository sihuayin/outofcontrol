import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('room', [
      'joinVideo'
    ]),
    async goLive(id) {
      try {
        await this.joinVideo(id)
        this.$router.push(`/room/${id}`)
      } catch(e) {
        this.$message.error(e.message)
      }
    },
  }
}