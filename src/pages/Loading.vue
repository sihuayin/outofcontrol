<template>
  <div class="loading-container">
    <a-spin size="large" v-if="check"/>
    <a-progress :percent="percentage" status="active" v-if="dialogVisible"/>
  </div>
</template>
<script>
// import auth from '../libs/auth'
let ipcRenderer = require("electron").ipcRenderer;
export default {
  name: 'Loading',
  data() {
    return {
      check: true,
      dialogVisible: false,
      percentage: 0
    }
  },
  mounted() {
    ipcRenderer.on("message", (event, arg) => {
      if ("update-available" == arg.cmd) {
        //显示升级对话框
        this.dialogVisible = true;
        this.check = false
      } else if ("download-progress" == arg.cmd) {
        //更新升级进度
        /**
         * 
         * message{bytesPerSecond: 47673
          delta: 48960
          percent: 0.11438799862426002
          total: 42801693
          transferred: 48960
          }
        */
        console.log(arg.message.percent);
        let percent = Math.round(parseFloat(arg.message.percent));
        this.percentage = percent;
      } else if ("error" == arg.cmd) {
        this.dialogVisible = false;
        this.check = false
        // this.$message("更新失败");
      }
    })
    ipcRenderer.send("checkForUpdate");
    // todo 询问是否有新的版本
    setTimeout(() => {
      // this.$router.replace('/login')
    }, 2000)
    // setTimeout(() => {
    //   if (!auth.loggedIn()) {
    //     this.$router.replace('/login')
    //   } else if (auth.isZhuanjia()) {
    //     this.$router.replace('/home')
    //   } else {
    //     this.$router.replace('/vistor')
    //   }
    // }, 1000)
  }
}
</script>

<style>
.loading-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

