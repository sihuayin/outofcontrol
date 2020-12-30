<template>
  <a-layout class="main">
      <a-layout-header>Header</a-layout-header>
      <a-layout-content>
        <a-calendar @panelChange="onPanelChange">
          <ul slot="dateCellRender" slot-scope="value" class="events">
            <a-button type="primary" icon="search" v-for="item in getListData(value)" :key="item.id" @click="goLive(item.id)">
              {{item.date}}
            </a-button>
          </ul>
        </a-calendar>
      </a-layout-content>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
</template>
<script>
import infiniteScroll from 'vue-infinite-scroll'
import { mapState, mapActions } from 'vuex'
import Rtm from '../libs/rtm'

export default {
  name: 'Home',
  directives: { infiniteScroll },
  computed: mapState({
    specialists: state => state.specialist.list
  }),
  data() {
    return {
      busy: false,
      loading: false,
      data: [{
        email: 'test',
        name: {
          last: 'tt'
        }
      }]
    }
  },
  async mounted() {
    this.getSpecialists()
    this.rtm = new Rtm()
    await this.rtm.init({
      appId: 'f75ff0253dab479d8c760d4f141ef4d0',
      uploadLog: './log',
      uid: '' + Math.floor(new Date().getTime() / 1000),
      channelName: 'demoChannel'
    })

    const [channel, bus] = this.rtm.createObserverChannel('demoChannel')
    await this.rtm.join(channel, bus, {
      channelName: 'demoChannel'
    })
  },
  methods: {
    ...mapActions('specialist', [
      'getSpecialists'
    ]),
    handleInfiniteOnLoad() {},
    goRoom() {
      this.$router.push("/root")
    },
    goLive(id) {
      this.$router.push(`/room/${id}`)
    },
    onPanelChange() {},
    getListData(value) {
      return this.specialists.filter((item) => item.date === value.format('YYYY-MM-DD'))
    }
  }
}
</script>

<style>
.main {
  height: 100%;
}
.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 300px;
}
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
</style>

