<template>
  <q-card class="q-mt-md" style="min-width: 300px">
    <q-card-section class="row justify-between">
      <span class="text-h6">
        {{ guild.name }}
        <q-avatar v-if="edit" icon="edit" size="md" />
        <q-popup-edit
          v-if="edit"
          buttons
          v-model="form.name"
          :validate="nameValidation"
          @hide="nameValidation"
        >
          <q-input
            dense
            autofocus
            v-model="form.name"
            :error="errorName"
          />
        </q-popup-edit>
      </span>

      <q-chip outline color="primary" text-color="white" icon="account_circle" style="cursor: pointer" >
        {{ guild.owner.nickname }}
        <q-popup-proxy>
            <UserCard :user="guild.owner"/>
        </q-popup-proxy>
      </q-chip>
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <div class="text-body2">
        {{ guild.desc }}
        <q-avatar v-if="edit" icon="edit" size="md" />
        <q-popup-edit
          v-if="edit"
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
    </q-card-section>

    <q-card-actions align="between">
      <span class="text-weight-bold">
        <q-avatar icon="group" size="md" />
        {{ guild.number }}
      </span>
      <q-select
        v-if="edit"
        borderless
        v-model="form.join"
        :options="options"
        @input="changeJoin"
      />
      <span v-if="!edit" :class="'text-'+color[guild.join]">{{ options[guild.join].label }}</span>
    </q-card-actions>

    <q-card-actions>
      <q-btn v-if="!edit" style="width: 100%" @click="leave" :label="$t('guild.guildDetailCard.leave')" color="negative" />
      <q-btn v-if="edit" style="width: 100%" @click="guildDelete" :label="$t('guild.guildDetailCard.delete')" color="negative" />
    </q-card-actions>

    <q-inner-loading :showing="loading">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>

    <q-dialog v-model="promptPassword" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ $t('guild.guildDetailCard.password') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="form.password" autofocus :error="errorPassword" :error-message="$t('guild.GuildDetailCard.errorPassword')" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('guild.guildDetailCard.setPassword')" @click="passwordValidation" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script lang="ts">
import { Vue, Component, Watch, Model, Prop } from 'vue-property-decorator'
import UserCard from 'components/UserCard.vue'

@Component({
  components: {
    UserCard
  }
})
export default class GuildDetailCard extends Vue {
  loading = false

  @Model() guild !: any
  @Prop({ default: false }) edit !: boolean

  color = [
    'positive',
    'warning',
    'primary',
    'negative'
  ]

  form = {
    name: '',
    desc: '',
    join: {},
    password: ''
  }

  get options () {
    return [
      { label: this.$t('guild.guildDetailCard.joinAuto'), value: 0 },
      { label: this.$t('guild.guildDetailCard.joinPassword'), value: 1 },
      { label: this.$t('guild.guildDetailCard.joinValidate'), value: 2 },
      { label: this.$t('guild.guildDetailCard.joinForbid'), value: 3 }
    ]
  }

  errorName = false
  errorDesc = false
  errorPassword = false
  promptPassword = false

  @Watch('guild', { immediate: true })
  onChangeUser (val: any) {
    this.form.name = val.name
    this.form.desc = val.desc
    this.form.join = this.options[val.join]
  }

  guildEdit (data: any) {
    this.loading = true
    this.$axios.post('guild/edit', data)
      .then(() => {
        Object.assign(this.guild, data)
      })
      .finally(() => {
        this.loading = false
      })
  }

  nameValidation (val: string) {
    if (val === undefined) return
    if (!!val && val.length <= 16) {
      this.errorName = false
      this.guildEdit({
        name: val
      })
      return true
    } else {
      this.errorName = true
      return false
    }
  }

  descValidation (val: string) {
    if (val === undefined) return
    if (val.length <= 32) {
      this.errorDesc = false
      this.guildEdit({
        desc: val
      })
      return true
    } else {
      this.errorDesc = true
      return false
    }
  }

  passwordValidation () {
    if (/^[a-zA-Z\d\x21-\x7e]{1,16}$/.exec(this.form.password) !== null) {
      this.guildEdit({
        password: this.form.password,
        join: 1
      })
      this.promptPassword = false
    } else {
      this.errorPassword = true
    }
  }

  changeJoin (val: any) {
    if (val.value === 1) {
      this.promptPassword = true
    } else {
      this.guildEdit({ join: val.value })
    }
  }

  leave () {
    this.$q.dialog({
      title: this.$t('guild.guildCard.leave') as string,
      message: this.$t('guild.guildCard.leaveMessage') as string,
      cancel: true,
      persistent: true
    }).onOk(() => {
      this.loading = true
      this.$axios.post('guild/leave')
        .then(() => {
          this.$store.dispatch('user/getInfo')
            .then(() => {
              this.$router.replace('/')
            })
        })
        .catch(() => {
          this.loading = false
        })
    })
  }

  guildDelete () {
    this.$q.dialog({
      title: this.$t('guild.guildCard.delete') as string,
      message: this.$t('guild.guildCard.deleteMessage') as string,
      cancel: true,
      persistent: true
    }).onOk(() => {
      this.loading = true
      this.$axios.delete('guild/delete')
        .then(() => {
          this.$store.dispatch('user/getInfo')
            .then(() => {
              this.$router.replace('/')
            })
        })
        .catch(() => {
          this.loading = false
        })
    })
  }
}
</script>
