<template>
  <a-layout class="main">
      <CommonHeader />
      <a-layout-content>
        <div :style="{
        display: 'inline-block',
        width: '100%',
        height: '100%',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        overflow: 'hiddden'
      }">
        <a-calendar :value="value"  @panelChange="onPanelChange" :header-render="headerRender">
          <div slot="dateCellRender" slot-scope="value" class="events">
            <a-button type="primary" icon="user-add" v-for="item in getListData(value)" :key="item.id" @click="goLive(item.id)">
              {{item.id}}
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
import auth from '../libs/auth'
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
      id: auth.id, data: {
      month: this.value.format('YYYY-MM')
    }})
  },
  methods: {
    ...mapActions('specialist', [
      'getSpecialists'
    ]),

    getListData(value) {
      return this.specialists.filter((item) => item.date === value.format('YYYY-MM-DD'))
    },

    refresh() {
      this.getSpecialists({
        id: auth.id, data: {
        month: this.value.format('YYYY-MM')
      }})
    },

    onPanelChange(now) {
      console.log(arguments)
      this.value = now
    },
    headerRender({ value, onChange }) {
      const start = 0;
      const end = 12;
      const monthOptions = [];

      const current = value.clone();
      const localeData = value.localeData();
      const months = [];
      for (let i = 0; i < 12; i++) {
        current.month(i);
        months.push(localeData.monthsShort(current));
      }

      for (let index = start; index < end; index++) {
        monthOptions.push(
          <a-select-option class="month-item" key={`${index}`}>
            {months[index]}
          </a-select-option>,
        );
      }
      const month = value.month();

      const year = value.year();
      const options = [];
      for (let i = year - 10; i < year + 10; i += 1) {
        options.push(
          <a-select-option key={i} value={i} class="year-item">
            {i}
          </a-select-option>,
        );
      }
      return (
        <div style={{ padding: '10px' }}>
          <a-row type="flex" justify="space-between">
            <a-col>
              <a-button type="primary" onClick={() => this.refresh()}><a-icon type="sync" />刷新</a-button>
            </a-col>
            <a-col>
            <a-select
                size="small"
                dropdownMatchSelectWidth={false}
                class="my-year-select"
                onChange={newYear => {
                  const now = value.clone().year(newYear);
                  onChange(now);
                }}
                value={String(year)}
              >
                {options}
              </a-select>
              <a-select
                size="small"
                dropdownMatchSelectWidth={false}
                value={String(month)}
                onChange={selectedMonth => {
                  const newValue = value.clone();
                  newValue.month(parseInt(selectedMonth, 10));
                  onChange(newValue);
                }}
              >
                {monthOptions}
              </a-select>
            </a-col>
          </a-row>
        </div>
      );
    },
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

.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}
.notes-month {
  text-align: center;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}
</style>

