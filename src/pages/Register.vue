<template>
  <q-page class="row q-pa-md justify-center">
    <div
      class="q-gutter-y-md relative-position"
      style="width: 300px"
      @keydown.enter="register"
    >
      <div class="text-h4 q-pa-md text-center">{{ $t('register.title') }}</div>
      <q-input
        autofocus
        filled
        ref="nickname"
        v-model="nickname"
        :rules="[
          val => val.match(/^.{1,16}$/) || $t('register.nicknameRules'),
          val => !!val || $t('register.nicknameRules')
        ]"
        :label="$t('user.nickname')"
        :hint="$t('register.nicknameHint')"
      />
      <q-input
        filled
        ref="username"
        v-model="username"
        :rules="[
          val => val.match(/^[a-zA-Z\d_]{4,24}$/) || $t('register.usernameRules'),
          val => !!val || $t('register.usernameRules')
        ]"
        :label="$t('user.username')"
      />
      <q-input
        filled
        ref="password"
        type="password"
        v-model="password"
        :rules="[
          val => val.match(/^(?=.*[a-z])(?=.*\d)[a-zA-Z\d\x21-\x7e]{8,24}$/) || $t('register.passwordRules'),
          val => !!val || $t('register.passwordRules')
        ]"
        :label="$t('user.password')"
      />
      <q-input
        filled
        ref="confirmPassword"
        type="password"
        v-model="confirmPassword"
        :rules="[
          val => val === password || $t('register.confirmPasswordRules'),
          val => !!val || $t('register.confirmPasswordRules')
        ]"
        :label="$t('register.confirmPassword')"
        @blur="event => $refs.confirmPassword.validate()"
      />
      <div class="row justify-between items-center">
        <router-link to="/login">
          {{ $t('register.login') }}
        </router-link>
        <q-btn
          unelevated
          color="primary"
          :label="$t('register.submit')"
          @click="register"
        />
      </div>
      <q-inner-loading :showing="loading">
        <q-spinner-ios size="50px" color="primary" />
      </q-inner-loading>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { QInput } from 'quasar'

@Component
export default class Register extends Vue {
  public $refs !: {
    nickname: QInput;
    username: QInput;
    password: QInput;
    confirmPassword: QInput;
  }

  loading = false

  nickname = ''
  username = ''
  password = ''
  confirmPassword = ''

  register () {
    if (!(
      this.$refs.nickname.validate() &&
      this.$refs.username.validate() &&
      this.$refs.password.validate() &&
      this.$refs.confirmPassword.validate()
    )) return

    this.loading = true
    this.$axios.post('user/register', {
      username: this.username,
      password: this.password,
      nickname: this.nickname
    })
      .then(() => {
        this.$router.replace('login')
      })
      .catch(error => {
        this.$q.notify({
          message: error.response ? error.response.data : error.message,
          color: 'negative',
          position: 'top',
          icon: 'report_problem',
          multiLine: true
        })
      })
      .finally(() => {
        this.loading = false
      })
  }
}

</script>
