<template>
  <a-dropdown>
    <a class="ant-dropdown-link" @click="e => e.preventDefault()">
      {{userName}} <a-icon type="down" />
    </a>
    <a-menu slot="overlay">
      <a-menu-item>
        <a href="javascript:;" @click="goMyDating">我的预约</a>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item>
        <a href="javascript:;" @click="goTesting">设备检测</a>
      </a-menu-item>
      <a-menu-divider />

      <a-menu-item>
        <a href="javascript:;" @click="logout">退出</a>
      </a-menu-item>
    </a-menu>

  </a-dropdown>
  
</template>
<script>
import { mapActions } from 'vuex'
import { Modal } from 'ant-design-vue'
import auth from '../libs/auth'

export default {
  name: 'LogoutButton',
  data () {
    return {
      userName: auth.name
    }
  },
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
    },
    goMyDating() {
      this.$router.push('/dating')
    },
    goTesting() {
      this.$router.push('/testing')
    }
  }
}
</script>
