<template>
  <a-layout class="main">
    <SecondHeader />
    <a-layout-content :style="{marginTop: '20px'}">
      <a-table @change="pageChange" :columns="columns" :data-source="datings" rowKey="appointmentid" :pagination="{total, pageSize}">
        <a slot="name" slot-scope="text">{{ text }}</a>

        <span slot="action" slot-scope="text">
          <a-tag :color="text.participated ? 'green' : 'red'">{{text.participated ? '已参与' : '未参加'}}</a-tag>
        </span>
      </a-table>
    </a-layout-content>
  </a-layout>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import SecondHeader from '../components/SecondHeader'

const columns = [
  {
    dataIndex: 'appointmentid',
    key: 'appointmentid',
    title: '预约id'
  },
  {
    title: '专家',
    dataIndex: 'expertname',
    key: 'expertname',
  },
  {
    title: '描述',
    dataIndex: 'appointmentdesc',
    key: 'appointmentdesc',
    ellipsis: true,
  },
  {
    title: '过期时间',
    dataIndex: 'enddttm',
    key: 'enddttm',
    ellipsis: true,
  },
  {
    title: '状态',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  }
];

export default {
  name: 'DatingPage',
  components: {
    SecondHeader
  },
  data() {
    return {
      columns
    };
  },
  computed: mapState({
    datings: state => state.docter.datings,
    total: state=> state.docter.datingTotal,
    pageSize: state => state.docter.datingPageSize
  }),
  mounted() {
    this.getDocterDatings({
      page: 1
    })
  },
  methods: {
    ...mapActions('docter', [
      'getDocterDatings'
    ]),
    pageChange({current}) {
      this.getDocterDatings({
        page: current
      })
    }
  }
}
</script>
