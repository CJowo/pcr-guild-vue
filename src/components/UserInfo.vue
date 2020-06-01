<template>
    <q-card style="width: 250px">
    <q-card-section v-if="!user.username">
      {{ $t('user.nologin') }}
    </q-card-section>
    <q-card-section class="q-gutter-y-md" v-if="user.username">
      <div class="row items-center q-gutter-sm">
        <q-avatar color="primary" text-color="white" icon="account_circle" size="md" />
        <span class="text-h6">
          {{ user.nickname }}
          <q-icon name="edit" />
          <q-popup-edit
            buttons
            v-model="form.nickname"
            :validate="nicknameValidation"
            @hide="nicknameValidation"
          >
            <q-input
              dense
              autofocus
              v-model="form.nickname"
              :error="errorNickname"
            />
          </q-popup-edit>
        </span>
      </div>

      <div class="row q-gutter-x-lg">
        <q-field borderless :label="$t('user.username')" stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">{{ user.username }}</div>
          </template>
        </q-field>

        <q-field borderless :label="$t('user.create')" stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">{{ formatDate(user.create*1000) }}</div>
          </template>
        </q-field>
      </div>

      <q-field borderless :label="$t('user.desc')" stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">
            <div class="q-mt-xs" style="white-space: pre">{{ user.desc }}<q-avatar icon="edit" size="md" /></div>
            <q-popup-edit
              persistent
              buttons
              v-model="form.desc"
              :validate="descValidation"
              @hide="descValidation"
            >
              <q-input
                dense
                autofocus
                autogrow
                type="textarea"
                v-model="form.desc"
                :error="errorDesc"
                @keyup.enter.stop
              />
            </q-popup-edit>
          </div>
        </template>
      </q-field>
    </q-card-section>

    <q-card-actions align="around" v-if="user.username">
      <q-btn flat :disable="true" >{{ $t('user.setPassword') }}</q-btn>
      <router-link to="/logout">
        <q-btn flat color="negative" >{{ $t('user.logout') }}</q-btn>
      </router-link>
    </q-card-actions>

    <q-inner-loading :showing="loading">
        <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class UserInfo extends Vue {
  loading = false

  get user () { return this.$store.state.user.data }

  form = {
    nickname: '',
    desc: ''
  }

  errorNickname = false
  errorDesc = false

  @Watch('user', { immediate: true })
  onChangeUser (val: any) {
    this.form.nickname = val.nickname
    this.form.desc = val.desc
  }

  formatDate (timestamp: number) {
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }

  edit (data: any) {
    this.$axios.post('user/edit', data)
      .then(() => {
        this.$store.dispatch('user/getInfo')
          .finally(() => {
            this.loading = false
          })
      })
      .catch(() => {
        this.loading = false
      })
  }

  nicknameValidation (val: string) {
    if (val === undefined) return
    if (!!val && val.length <= 16) {
      this.loading = true
      this.errorNickname = false
      this.edit({
        nickname: val
      })
      return true
    } else {
      this.errorNickname = true
      return false
    }
  }

  descValidation (val: string) {
    if (val === undefined) return
    if (val.length <= 32) {
      this.loading = true
      this.errorDesc = false
      this.edit({
        desc: val
      })
      return true
    } else {
      this.errorDesc = true
      return false
    }
  }
}
</script>
