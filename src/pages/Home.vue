<template>
  <a-layout class="main">
      <a-layout-header>Header
        <LogoutButton />
      </a-layout-header>
      <a-layout-content>
        <a-calendar @panelChange="onPanelChange">
          <ul slot="dateCellRender" slot-scope="value" class="events">
            <a-button type="primary" icon="search" v-for="item in getListData(value)" :key="item.id" @click="goLive(item.id)">
              {{item.date}}
            </a-button>
          </ul>
        </a-calendar>
      </a-layout-content>
      <a-layout-footer>Footer -> <span>specialist: {{specialist.name}}</span><span>vistor: {{vistor.name}}</span></a-layout-footer>
    </a-layout>
</template>
<script>
import infiniteScroll from 'vue-infinite-scroll'
import { mapState, mapActions } from 'vuex'
import joinMixin from '../mixins/joinMixin'
import LogoutButton from '../components/LogoutButton'

export default {
  name: 'Home',
  components: {
    LogoutButton
  },
  directives: { infiniteScroll },
  mixins: [joinMixin],
  computed: mapState({
    specialists: state => state.specialist.list,
    specialist: state => state.room.specialist,
    vistor: state => state.room.vistor
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
  },
  methods: {
    ...mapActions('specialist', [
      'getSpecialists'
    ]),

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

