<template>
  <a-layout class="main">
    
    <SecondHeader />
    <a-layout-content :style="{marginTop: '20px'}">
      <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="lessons">
        <a-list-item slot="renderItem" key="item.docid" slot-scope="item">
          <template  slot="actions">
            <a-button @click="$router.push('/videoinfo')">观看</a-button>
          </template>
          <img
            slot="extra"
            width="272"
            alt="logo"
            :src="item.url"
            v-if="!item.mimetype"
          />
          <img
            slot="extra"
            width="272"
            alt="logo"
            src="../assets/video.png"
            v-else
          />
          <a-list-item-meta :description="item.doctitle">
            <a slot="title" :href="item.href">{{ item.fullname }}</a>
          </a-list-item-meta>
          {{ item.docdesc }}
        </a-list-item>
  </a-list>
    </a-layout-content>
  </a-layout>
</template>
<script>
import SecondHeader from '../components/SecondHeader'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'VideoList',
  components: {
    SecondHeader
  }, 
  computed: mapState({
    lessons: state => state.docter.lessons,
    lessonPage: state=> state.docter.lessonPage,
    lessonTotal: state => state.docter.lessonTotal,
    lessonLoading: state => state.docter.lessonLoading
  }),
  data() {
    return {
      pagination: {
        onChange: page => {
          console.log(page);
        },
        pageSize: 3,
      }
    };
  },
  mounted() {
    this.getDocterLesson({
      page: 1,
      pageSize: 10
    })
  },
  methods: {
    ...mapActions('docter', [
      'getDocterLesson'
    ]),
  }
}
</script>
