<template>
<div>{{auto}}
    <a-modal v-model="visible" title="检查更新" @ok="handleOk">
      <a-progress :percent="percentage" status="active" />
    </a-modal>
  </div>
    
</template>

<script>
let ipcRenderer = require("electron").ipcRenderer;
export default {
    name: 'UpdateWindow',
    props: {
      auto: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        visible: false,
        percentage: 0
      };
    },
    methods: {
      handleOk() {
          // console.log(e);
          // this.visible = false;
      }
    },
    watch: {
      auto: function (newVal) {
        console.log('auto changed', newVal)
        if (newVal) {
          ipcRenderer.send("checkForUpdate");
        }
      }
    },
    beforeDestroy(){
      ipcRenderer.removeAllListeners()
    },
    mounted() {
    ipcRenderer.on("message", (event, arg) => {
      console.log('receive message', arg)
      if ("update-available" == arg.cmd) {
        //显示升级对话框
        this.visible = true
        this.$emit('update', true)
      } else if ("download-progress" == arg.cmd) {
        console.log(arg.message.percent);
        let percent = Math.round(parseFloat(arg.message.percent));
        this.percentage = percent;
      } else if ("error" == arg.cmd) {
        this.$emit('update', false)
        this.visible = false;
        this.$message.error('升级失败')
      } else {
        this.$emit('update', false)
      }
    })

    if (this.auto) {
      ipcRenderer.send("checkForUpdate");
    }
  }
}
</script>