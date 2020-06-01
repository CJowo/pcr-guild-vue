<template>
  <div class="q-gutter-md q-mt-md">
    <div v-if="battle.title" class="row justify-center items-center">
      <span class="q-mt-md"> {{ $t('admin.battle') }} {{ battle.title }} </span>
      <q-btn color="negative" :label="$t('admin.close')" class="q-ml-md q-mt-md" @click="closeBattle"/>
    </div>
    <div v-if="!battle.title" class="row justify-center items-center">
      <q-input fill :label="$t('admin.title')" class="q-mt-md" v-model="title"/>
      <q-btn color="primary" :label="$t('admin.create')" class="q-ml-md q-mt-md" @click="createBattle" />
    </div>
    <div class="row justify-center items-center q-gutter-md">
      <q-toggle v-model="register" :label="$t('admin.register')" @input="edit"/>
      <q-toggle v-model="guild" :label="$t('admin.guild')" @input="edit"/>
      <q-btn :label="$t('admin.setPassword')" @click="setPassword" />
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class AdminDetail extends Vue {
  loading = true

  title = ''
  battle: any = {}
  register = false
  guild = false

  created () {
    this.load()
  }

  load () {
    Promise.all([
      this.$axios.get('admin/info')
        .then(response => {
          this.register = response.data.register
          this.guild = response.data.guild
        }),
      this.$axios.get('battle/info')
        .then(response => {
          this.battle = response.data
        })
    ])
      .finally(() => {
        this.loading = false
      })
  }

  setPassword () {
    this.$q.dialog({
      title: 'New password',
      prompt: {
        model: '',
        isValid: (val: string) => val.length > 0 && val.length < 24,
        type: 'password'
      },
      cancel: true,
      persistent: true
    }).onOk((data: string) => {
      this.loading = true
      this.$axios.post('admin/password', {
        password: this.$store.state.admin.password,
        newPassword: data
      })
        .then(() => {
          this.$store.commit('admin/update', null)
          this.$router.replace('/admin/validate')
        })
        .finally(() => {
          this.loading = false
        })
    })
  }

  createBattle () {
    this.loading = true
    this.$axios.post('battle/create', {
      title: this.title,
      password: this.$store.state.admin.password
    })
      .then(response => {
        this.battle = response.data
      })
      .finally(() => {
        this.loading = false
      })
  }

  closeBattle () {
    this.$q.dialog({
      title: 'Close',
      message: this.battle.title + ' will be closed',
      cancel: true,
      persistent: true
    })
      .onOk(() => {
        this.loading = true
        this.$axios.post('battle/close', {
          password: this.$store.state.admin.password
        })
          .then(() => {
            this.battle = {}
          })
          .finally(() => {
            this.loading = false
          })
      })
  }

  edit () {
    this.loading = true
    this.$axios.post('admin/edit', {
      password: this.$store.state.admin.password,
      register: this.register,
      guild: this.guild
    })
      .then(response => {
        this.register = response.data.register
        this.guild = response.data.guild
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>
