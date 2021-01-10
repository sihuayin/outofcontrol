<template>
  <div class="test-tab-del-device d-voice">
    <a-select placeholder="请选择麦克风" style="width: 120px" @change="handleMicChange">
      <a-select-option value="-1">
        请选择
      </a-select-option>
      <a-select-option :value="index" v-for="(dev, index) in audioDevices" v-bind:key="index">
        {{dev.devicename}}
      </a-select-option>
    </a-select>
    <a-row>
      <p>点击“录音”按钮，看看绿色音量绿色是否有波动</p>
    </a-row>
    
    <a-row>
      <a-progress type="circle" :percent="voiceValue">
        <template :format="voiceValue">
          <span style="color: red">{{ voiceValue }}</span>
        </template>
      </a-progress>
    </a-row>

    <a-row>
      <a-button type="danger" v-if="recordingTestOn" @click.stop="toggleRecordingTest"><a-icon type="play-circle" />停止</a-button>
      <a-button type="primary" v-else @click.stop="toggleRecordingTest"><a-icon type="play-circle" /> 录音</a-button>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'MicphoneTest',
  data () {
    return {
      audioDevices: this.$sdk.client.getAudioRecordingDevices(),
      mic: 0,
      voiceValue: 0,
      recordingTestOn: false
    }
  },
  methods: {
    handleMicChange (value) {
      if (value <= 0) {
        return
      }
      this.mic = value
      this.$sdk.client.setAudioRecordingDevice(this.audioDevices[value].deviceid)
    },
    setSound (val) {
      this.soundValue = val
      // 设定音量
      this.$sdk.client.setAudioPlaybackVolume(val)
    },
    handleVolme({totalVolume}) {
      this.voiceValue = Math.ceil((totalVolume / 255) * 100)
    },
    toggleRecordingTest () {
      if (!this.recordingTestOn) {
        this.$sdk.openTestMicrophone()
        this.$sdk.on('volume-indication', (...arg) => this.handleVolme(...arg))
      } else {
        this.voiceValue = 0
        this.$sdk.client.stopAudioRecordingDeviceTest()
      }
      this.recordingTestOn = !this.recordingTestOn
    }
  },
  beforeDestroy () {
    this.recordingTestOn = false
    this.$sdk.client.stopAudioRecordingDeviceTest()
  }
}
</script>
<style>
ant-progress-circle,
ant-progress-line {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
