<template>
  <a-layout class="main">
    <SecondHeader />
    <a-layout-content :style="{marginTop: '20px'}">
      <div class="video-container" >
        <template v-if="type === 'image'">
          <viewer :images="images">
            <img v-for="src in images" :src="src" :key="src">
          </viewer>
        </template>
        <template v-else>
          <video width="620" controls>
            <source
              :src="video"
              type="video/mp4">
          </video>
        </template>
      </div>

    </a-layout-content>
  </a-layout>
</template>
<script>
import SecondHeader from '../components/SecondHeader'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer/src/component.vue'

export default {
  name: 'VideoInfo',
  components: {
    SecondHeader,
    Viewer
  },
  data() {
    return {
      type: '',
      images: [],
      video: ''
    }
  },
  created() {
    const {item} = this.$route.query
    if (item) {
      if (!item.mimetype) {
        this.type = 'image'
        this.images = [item.url]
      } else {
        this.type = 'video'
        this.video = item.url
      }
    }
  
  }
}
</script>

<style>
.video-container {
  height: 400px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
