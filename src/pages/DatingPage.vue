<template>
  <a-layout class="main">
    <SecondHeader />
    <a-layout-content :style="{marginTop: '20px'}">
      <a-table :columns="columns" :data-source="datings">
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
        <span slot="tags" slot-scope="tags">
          <a-tag
            v-for="tag in tags"
            :key="tag"
            :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a>Invite 一 {{ record.name }}</a>
          <a-divider type="vertical" />
          <a>Delete</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
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
    dataIndex: 'id',
    key: 'id',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' },
  },
  {
    title: 'title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Action',
    key: 'action',
    customRender: (text) => {
      return text.status > 1 ? '已经预约' :'预约中'
    },
  }
];

export default {
  name: 'DatingPage',
  components: {
    SecondHeader
  },
  data() {
    return {
      columns,
    };
  },
  computed: mapState({
    datings: state => state.docter.datings
  }),
  mounted() {
    this.getDocterDatings()
  },
  methods: {
    ...mapActions('docter', [
      'getDocterDatings'
    ])
  }
}
</script>
