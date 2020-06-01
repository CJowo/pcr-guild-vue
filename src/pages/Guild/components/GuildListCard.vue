<template>
  <q-card style="width: 300px">
    <q-card-section class="row justify-between">
      <span class="text-h6">
        {{ guild.name }}
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
      </div>
    </q-card-section>
    <q-card-actions align="between">
      <span class="text-weight-bold">
        <q-avatar icon="group" size="md" />
        {{ guild.number }}
      </span>
      <q-btn flat :color="color[guild.join]" @click="join">
        {{ joinMethods[guild.join] }}
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { Vue, Component, Model } from 'vue-property-decorator'
import UserCard from 'components/UserCard.vue'

@Component({
  components: {
    UserCard
  }
})
export default class GuildListCard extends Vue {
  @Model() guild !: any

  color = [
    'positive',
    'warning',
    'primary',
    'negative'
  ]

  get joinMethods () {
    return [
      this.$t('guild.guildCard.joinAuto'),
      this.$t('guild.guildCard.joinPassword'),
      this.$t('guild.guildCard.joinValidate'),
      this.$t('guild.guildCard.joinForbid')
    ]
  }

  join () {
    switch (this.guild.join) {
      case 0:
        this.$q.dialog({
          title: this.$t('guild.guildCard.joinConfirm') as string,
          message: this.guild.name,
          cancel: true,
          persistent: true
        })
          .onOk(() => {
            this.guildJoin({})
          })
        break
      case 1:
        this.$q.dialog({
          title: this.$t('guild.guildCard.password') as string,
          prompt: {
            model: '',
            type: 'text'
          },
          cancel: true,
          persistent: true
        }).onOk((data: string) => {
          this.guildJoin({
            password: data
          })
        })
        break
      case 2:
        this.$q.dialog({
          title: this.$t('guild.guildCard.apply') as string,
          prompt: {
            model: '',
            type: 'text',
            isValid: (val: string) => val.length <= 32
          },
          cancel: true,
          persistent: true
        }).onOk((data: string) => {
          this.guildJoin({
            desc: data
          })
            .then(() => {
              this.$q.dialog({
                message: this.$t('guild.guildCard.applyS') as string
              })
            })
        })
        break
    }
  }

  guildJoin (data: any) {
    return this.$axios.post('guild/join', Object.assign({ id: this.guild.id }, data))
      .then(response => {
        if (response.data === 'Successfully joined') {
          this.$store.dispatch('user/getInfo')
            .then(() => {
              this.$router.replace('/guild')
            })
        }
      })
  }
}
</script>
