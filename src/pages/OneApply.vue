<template>
   <a-layout class="main">
     <a-layout-header>
      <a-row type="flex" justify="space-around">
        <a-col :span="20">
          <img src="../assets/nanshi.png" width="150"/>
        </a-col>
        <a-col :span="4">
          <a-row type="flex" justify="space-around">
            <a-space>
              <a-button @click="$router.go(-1)" type="primary">
                <a-icon type="close-circle" />返回
              </a-button>
            </a-space>
          </a-row>
        </a-col>
      </a-row>
      </a-layout-header>
      
      <a-layout-content :style="{marginTop: '20px'}">
        <a-row>
          <a-form
            id="components-form-demo-validate-other"
            :form="form"
            v-bind="formItemLayout"
            @submit="handleSubmit"
          >
            <a-form-item label="标题">
              <a-input
                v-decorator="['title', { rules: [{ message: '请填写标题' }] }]"
              />
            </a-form-item>
            <a-form-item label="描述">
              <a-textarea
                v-decorator="['desc', { rules: [{ message: '请输入描述' }] }]"
              />
            </a-form-item>

            <a-form-item label="上传文件" extra="请上传医疗影像或病情描述文件">
              <a-upload
                v-decorator="[
                  'upload',
                  {
                    valuePropName: 'fileList',
                    getValueFromEvent: normFile,
                  },
                ]"
                name="files"
                action="/upload.do"
                list-type="picture"
              >
                <a-button> <a-icon type="upload" /> 上传 </a-button>
              </a-upload>
            </a-form-item>

          <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
            <a-button type="primary" html-type="submit">
              保存
            </a-button>
          </a-form-item>
        </a-form>
        </a-row>
      </a-layout-content>
    </a-layout>
</template>
<script>

import { mapActions } from 'vuex'
import { message } from 'ant-design-vue'
import { setTimeout } from 'timers';

export default {
  name: 'OneApply',
  data: () => ({
    formItemLayout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    },
  }),
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'validate_other' });
  },
  methods: {
    ...mapActions('docter', [
      'addDocterDating'
    ]),
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          const ret = await this.addDocterDating(values)
          if (ret) {
            message.error(ret)
          } else {
            message.info('添加成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 500)
          }
        }
      });
    },
    normFile(e) {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    },
  },
}
</script>

<style>
#components-form-demo-validate-other .dropbox {
  height: 180px;
  line-height: 1.5;
}
</style>