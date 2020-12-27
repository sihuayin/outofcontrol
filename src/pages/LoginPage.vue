<template>
<div class="login-container">
  <div class="login-form">
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
      <a-form-item label="用户名">
        <a-input
          v-decorator="['username', { rules: [{ required: true, message: '请填写用户名' }] }]"
        />
      </a-form-item>
      <a-form-item label="密码">
        <a-input-password
          v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }] }]"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit">
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'LoginPage',
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
    };
  },
  computed: mapState({
    username: state => state.login.username
  }),
  methods: {
    ...mapActions('login', [
      'doLogin'
    ]),
    handleSubmit(e) {
      e.preventDefault();
      console.log(this)
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.doLogin().then((res) => {
            if (!res.success) {
              this.$message.error(res.message)
            } else {
              this.$router.replace('/')
            }
          })
        }
      });
    },
    handleSelectChange(value) {
      console.log(value);
      this.form.setFieldsValue({
        note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
      });
    },
  },
}
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 10px;
}
.login-form {
  flex: 1;
  width: 500px;
  height: 400px;
}
</style>
