<template>
  <a-layout class="main">
      <CommonHeader />
      <a-layout-content>
        <div :style="{
        display: 'inline-block',
        width: '100%',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
      }">
        <a-calendar :value="value"  @panelChange="onPanelChange">
          <div slot="dateCellRender" slot-scope="value" class="events">
            <a-button type="primary" icon="search" v-for="item in getListData(value)" :key="item.id" @click="goLive(item.id)">
              {{item.date}}
            </a-button>
          </div>
        </a-calendar>
      </div>
        
      </a-layout-content>

    </a-layout>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import joinMixin from '../mixins/joinMixin'
import CommonHeader from '../components/CommonHeader'
import moment from 'moment'
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export default {
  name: 'Home',
  components: {
    CommonHeader
  },
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
      value: moment()
    }
  },
  async mounted() {
    this.getSpecialists({
      month: moment().month() + 1
    })
  },
  methods: {
    ...mapActions('specialist', [
      'getSpecialists'
    ]),

    getListData(value) {
      if (value.format('YYYY-MM') !== this.value.format('YYYY-MM')) {
        return []
      }
      return this.specialists.filter((item) => item.date === value.format('YYYY-MM-DD'))
    },

    onPanelChange() {
      console.log(arguments)
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
.ant-fullcalendar-next-month-btn-day {
  display: none;
}
.ant-fullcalendar-fullscreen .ant-fullcalendar-cell .ant-fullcalendar-month, .ant-fullcalendar-fullscreen .ant-fullcalendar-cell .ant-fullcalendar-date {
  height: 100px;
}
</style>

