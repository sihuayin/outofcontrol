<template>
  <a-layout class="main">
    
    <SecondHeader />
    <a-layout-content :style="{marginTop: '20px'}">
      <a-list :loading="lessonLoading" :grid="{ gutter: 16, column: 4 }" :pagination="{total: lessonTotal, pageSize: lessonPageSize, onChange}" :data-source="lessons">
        <a-list-item slot="renderItem" key="item.docid" slot-scope="item">
          <a-card :title="item.doctitle" hoverable>
            <img
            slot="cover"
            width="272"
            alt="logo"
            :src="item.url"
            v-if="!item.mimetype"
          />
          <img
           slot="cover"
            width="272"
            alt="logo"
            src="../assets/video.png"
            v-else
          />
            
            <a-card-meta title="Europe Street beat">
            <template slot="description">
              {{ item.docdesc }}
            </template>
          </a-card-meta>
          <template slot="actions" class="ant-card-actions">
            <a-button type="primary" ghost @click="$router.push({name: 'videoinfo', query: {item}})">
              查看
            </a-button>
          </template>
          </a-card>
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
    lessonPageSize: state=> state.docter.lessonPageSize,
    lessonTotal: state => state.docter.lessonTotal,
    lessonLoading: state => state.docter.lessonLoading
  }),
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
    onChange(page) {
      this.getDocterLesson({
        page,
        pageSize: 10
      })
    }
  }
}
</script>
