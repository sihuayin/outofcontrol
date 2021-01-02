<template>
 <div class="form">
      <div class="logo">
        <img alt="logo" src="../assets/nanshi.png" />
      </div>
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" @submit="handleSubmit">
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
      <a-row>
        <a-button type="primary" html-type="submit" size="large">
          提交
        </a-button>
      </a-row>
    </a-form>
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

<style  lang="less">
.form {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -160px 0 0 -160px;
  width: 400px;
  height: 320px;
  padding: 36px;
  box-shadow: 0 0 100px rgba(0,0,0,.08);

  button {
    width: 100%;
  }

  p {
    color: rgb(204, 204, 204);
    text-align: center;
    margin-top: 16px;

    span {
      &:first-child {
        margin-right: 16px;
      }
    }
  }
}

.logo {
  text-align: center;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  margin-bottom: 24px;

  img {
    width: 250px;
    height: 60px;
    margin-right: 8px;
  }

  span {
    vertical-align: text-bottom;
    font-size: 16px;
    text-transform: uppercase;
    display: inline-block;
  }
}

.ant-spin-container,
.ant-spin-nested-loading {
  height: 100%;
}
</style>
