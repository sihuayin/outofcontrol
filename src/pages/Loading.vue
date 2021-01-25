<template>
  <div class="loading-container">
    <a-spin size="large" />
    <UpdateWindow @update="update" />
  </div>
</template>
<script>
import auth from '../libs/auth'
import UpdateWindow from '../components/UpdateWindow'
export default {
  name: 'Loading',
  components: {
    UpdateWindow
  },
  methods: {
    handleOk(){},
    update(isUpdate) {
      if (!isUpdate) {
        setTimeout(() => {
          if (!auth.loggedIn()) {
            this.$router.replace('/login')
          } else if (auth.isZhuanjia()) {
            this.$router.replace('/home')
          } else {
            this.$router.replace('/vistor')
          }
        }, 1000)
      }
    }
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

