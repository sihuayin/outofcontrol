<template>
  <div class="test-tab-del-device d-sound" >
     <a-select placeholder="请选择扬声器" style="width: 120px" @change="handleSpeakerChange">
      <a-select-option value="-1">
        请选择
      </a-select-option>
      <a-select-option :value="index" v-for="(dev, index) in audioPlaybackDevices" v-bind:key="index">
        {{dev.devicename}}
      </a-select-option>
    </a-select>

    <div class="test-audio">
      <p class="fc-gray">点击“播放”按钮，是否听到音频内容</p>
      <div class="test-audio-play"><a-button type="primary" @click.stop="play">{{isPlaying ? '暂停': '播放'}}</a-button></div>
      <a-slider id="test" :default-value="soundValue" @change="setSound" />
    </div>

    

    <audio
      ref="musicRef"
      :style="{ display: 'none' }"
      src="http://media.365kidsreading.com/testmusic.mp3"
    />
  </div>
</template>

<script>
export default {
  name: 'SoundTest',
  data () {
    return {
      audioPlaybackDevices: this.$sdk.client.getAudioPlaybackDevices(),
      speaker: 0,
      isPlaying: false,
      soundValue: 50
    }
  },
  methods: {
    handleSpeakerChange (value) {
      if (value < 0) {
        return
      }
      this.speaker = value
      this.$sdk.client.setAudioPlaybackDevice(this.audioPlaybackDevices[value].deviceid)
    },
    setSound (val) {
      console.log('ggod', val)
      this.soundValue = val
      // 设定音量
      this.$refs.musicRef.volume = val / 100
    },
    play () {
      if (!this.isPlaying) {
        this.$refs.musicRef.play()
      } else {
        this.$refs.musicRef.pause()
      }
      this.isPlaying = !this.isPlaying
    }
  },
  beforeDestroy () {
    this.isPlaying = false
  }
}
</script>
