<template>
  <a-button type="danger" @click="close">
    <a-icon type="poweroff" />
    关闭
  </a-button>
</template>

<script>
import { Modal } from 'ant-design-vue'
const { ipcRenderer } = require('electron')

export default {
  name: 'CloseButton',
  methods: {
    close () {
      Modal.confirm({
        title: '确定要关闭应用吗?',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          ipcRenderer.send('window-close')
        },
        onCancel() {
        },
        class: 'test',
      });
      
    }
  }
}
</script>
