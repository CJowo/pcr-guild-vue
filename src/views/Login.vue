<template>
  <div class="form" @keydown="keydown($event)">
    <el-form :model="form" :rules="rules" class="form" label-width="auto" label-position="top" ref="loginForm">
      <el-form-item>
        <div style="text-align: center; font-size: 20px;">{{ login? $t('login.login') : $t('login.register') }}</div>
      </el-form-item>
      <el-form-item :label="$t('login.username')" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item :label="$t('login.password')" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-link type="primary" style="float: left;" @click="login=!login">
          {{ login? $t('login.register') : $t('login.login') }}
        </el-link>
        <el-button type="primary" @click="submit()" :loading="loading" style="float: right;">
          {{ login? $t('login.login') : $t('login.register') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Login extends Vue {
  loading = false
  login = true

  form = {
    username: '',
    password: ''
  }

  rules = {
    username: [
      { required: true, message: window.i18n.t('error.required'), trigger: 'blur' },
      { min: 1, max: 16, message: window.i18n.t('error.range') + ' 1~16', trigger: 'blur' }
    ],
    password: [
      { required: true, message: window.i18n.t('error.required'), trigger: 'blur' },
      { min: 1, max: 16, message: window.i18n.t('error.range') + ' 1~16', trigger: 'blur' }
    ]
  }

  submit () {
    (this.$refs.loginForm as any).validate((valid: boolean) => {
      if (valid) {
        this.loading = true
        if (this.login) {
          this.$Http.login(this.form.username, this.form.password)
            .then(() => this.$router.push('/'))
            .finally(() => { this.loading = false })
        } else {
          this.$Http.register(this.form.username, this.form.password)
            .then(() => this.$router.push('/'))
            .finally(() => { this.loading = false })
        }
      } else {
        return false
      }
    })
  }

  keydown (event: KeyboardEvent) {
    if (event.keyCode === 13) this.submit()
  }
}
</script>

<style scoped>
.form {
  width: 70%;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
