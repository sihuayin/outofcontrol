<template>
  <a-layout class="main">
    <SecondHeader />
    <a-layout-content :style="{marginTop: '20px'}">
      <div class="video-container" >
        <video width="620" controls
          poster="https://upload.wikimedia.org/wikipedia/commons/e/e8/Elephants_Dream_s5_both.jpg" >
          <source
            src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
            type="video/mp4">
          <source
            src="https://archive.org/download/ElephantsDream/ed_hd.ogv"
            type="video/ogg">
          <source
            src="https://archive.org/download/ElephantsDream/ed_hd.avi"
            type="video/avi">
          Your browser doesn't support HTML5 video tag.
        </video>
      </div>
    </a-layout-content>
  </a-layout>
</template>
<script>
import SecondHeader from '../components/SecondHeader'
export default {
  name: 'VideoInfo',
  components: {
    SecondHeader
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
