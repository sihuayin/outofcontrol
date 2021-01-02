<template>
  <a-button type="primary" @click="logout">
    <a-icon type="logout" />退出
  </a-button>
</template>
<script>
import { mapActions } from 'vuex'
import { Modal } from 'ant-design-vue'
export default {
  name: 'LogoutButton',
  methods: {
    ...mapActions('login', [
      'doLogout'
    ]),
    logout() {
      Modal.confirm({
        title: '确定要退出吗?',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.doLogout()
          this.$router.replace("/login")
        },
        onCancel() {
        },
        class: 'test',
      });
    }
  }
}
</script>
