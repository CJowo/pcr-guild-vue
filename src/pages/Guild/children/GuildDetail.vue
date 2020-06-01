<template>
  <q-page>
    <q-tabs
      dense
      v-model="tab"
      class="text-primary"
    >
      <q-tab name="info" icon="info" :label="$t('guild.guildDetail.info')" />
      <q-tab name="users" icon="group" :label="$t('guild.guildDetail.users')" />
      <q-tab name="boxes" icon="inbox" :label="$t('guild.guildDetail.boxes')" />
      <q-tab name="applications" icon="event" :label="$t('guild.guildDetail.applications')" v-if="operater"/>
    </q-tabs>
    <GuildDetailInfo v-if="tab==='info'" :auth="auth"/>
    <GuildDetailUsers v-if="tab==='users'" :users="users" :auth="auth" @refresh="load" />
    <GuildDetailBox v-if="tab==='boxes'" />
    <GuildDetailApplications v-if="tab==='applications'"/>

    <q-inner-loading :showing="loading">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import GuildDetailUsers from 'pages/Guild/components/GuildDetailUsers.vue'
import GuildDetailInfo from 'pages/Guild/components/GuildDetailInfo.vue'
import GuildDetailApplications from 'pages/Guild/components/GuildDetailApplications.vue'
import GuildDetailBox from 'pages/Guild/components/GuildDetaiBox.vue'

@Component({
  components: {
    GuildDetailInfo,
    GuildDetailUsers,
    GuildDetailApplications,
    GuildDetailBox
  }
})
export default class GuildDetail extends Vue {
  loading = false

  get user () { return this.$store.state.user.data }
  users: any = []
  get operater () {
    if (this.users.operaters === undefined) return false
    for (let i in this.users.operaters) {
      if (this.users.operaters[i].username === this.user.username) return true
    }
    return false
  }

  get owner () {
    if (this.users.owner === undefined) return false
    return this.users.owner.username === this.user.username
  }

  get auth () {
    if (this.owner) return 2
    else if (this.operater) return 1
    else return 0
  }

  tab = 'info'

  created () {
    this.load()
  }

  load () {
    this.loading = true
    this.$axios.get('guild/users')
      .then(response => {
        this.users = response.data
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>
