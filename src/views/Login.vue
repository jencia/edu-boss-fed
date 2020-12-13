<template>
  <div class="login">
    <h1 class="title">Edu boss 管理系统</h1>
    <el-card>
      <h3>登录</h3>
      <el-form ref="formRef" :model="formData" :rules="rules">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="formData.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { Form } from 'element-ui'
import { login } from '@/services/user'

const telRule = (rule: any, value: string, callback: (e?: any) => void) => {
  if (!/^1[0-9]{10}$/.test(value)) {
    callback(new Error('手机号码格式不正确'))
  }
  callback()
}

export default Vue.extend({
  name: 'Login',
  data () {
    return {
      loading: false,
      formData: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: telRule, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    async handleSubmit () {
      const validRes = await (this.$refs.formRef as Form)
        .validate()
        .catch(e => e)

      if (!validRes) {
        return
      }

      this.loading = true
      const { redirect } = this.$route.query
      const data = await login(this.formData)
        .finally(() => (this.loading = false))

      this.$message.success('登录成功')
      this.setUser(data)
      this.$router.push((redirect as string) ?? '/')
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
}
.title {
  margin: 72px 0 56px;
  font-size: 48px;
  font-weight: normal;
  color: rgba(0,0,0,.5);
}
.el-card {
  width: 400px;

  h3 {
    font-size: 24px;
    font-weight: normal;
    margin: 12px 0 20px;
  }
}
.el-button {
  width: 100%;
}
</style>
