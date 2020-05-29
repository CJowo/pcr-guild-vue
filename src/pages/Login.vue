<template>
  <q-page class="row q-pa-md justify-center">
    <div
      class="q-gutter-y-md relative-position"
      style="width: 300px"
      @keydown.enter="login"
    >
      <div class="text-h4 q-pa-md text-center">{{ $t('login.title') }}</div>
      <q-input
        lazy-rules
        autofocus
        filled
        ref="username"
        v-model="username"
        :rules="[val => !!val]"
        :label="$t('user.username')"
      />
      <q-input
        lazy-rules
        filled
        ref="password"
        type="password"
        v-model="password"
        :rules="[val => !!val]"
        :label="$t('user.password')"
      />
      <div class="row justify-between items-center">
        <router-link to="/register">
          {{ $t('login.register') }}
        </router-link>
        <q-btn
          unelevated
          color="primary"
          :label="$t('login.submit')"
          @click="login"
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
export default class Login extends Vue {
  public $refs !: {
    username: QInput;
    password: QInput;
  }

  loading = false

  username = ''
  password = ''

  login () {
    if (navigator.cookieEnabled !== true) {
      this.$q.notify({
        message: this.$t('login.cookie') as string,
        color: 'negative',
        position: 'top',
        icon: 'report_problem',
        multiLine: true
      })
    }
    if (!(
      this.$refs.username.validate() &&
      this.$refs.password.validate()
    )) return

    this.loading = true
    this.$axios.post('user/login', {
      username: this.username,
      password: this.password
    })
      .then(response => {
        this.$store.commit('user/update', response.data)
        this.$q.localStorage.set('login', true)
        this.$router.replace(this.$route.query.to as string | null || '/')
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
        this.password = ''
        this.loading = false
      })
  }
}

</script>
