<template>
  <q-page>
    <div class="text-h5 q-pl-md q-pt-md row items-center">
      {{ $t('guild.guildList.title') }}
      <q-avatar icon="add_circle_outline" text-color="primary" style="cursor: pointer" @click="createDialog=true">
        <q-tooltip>
          {{ $t('guild.guildList.createTip') }}
        </q-tooltip>
      </q-avatar>
    </div>
    <q-infinite-scroll ref="infiniteScroll" @load="onLoad" :offset="50">
      <div class="q-pa-md row items-start q-gutter-md justify-center justify-sm-start items-start">
        <GuildListCard v-for="(item, index) in list" :key="index" :guild="item" />
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <q-dialog v-model="createDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ $t('guild.guildList.create') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            ref="name"
            dense
            v-model="name"
            autofocus
            @keydown.enter="create"
            :hint="$t('guild.guildList.nameHint')"
            :rules="[
              val => val.length < 16 || $t('guild.guildList.nameRules'),
              val => !!val || $t('guild.guildList.nameRules'),
            ]"
          />
        </q-card-section>

        <q-card-actions align="around">
          <q-btn flat :label="$t('guild.guildList.createCancel')" v-close-popup />
          <q-btn flat color="primary" :label="$t('guild.guildList.createConfirm')" @click="create" />
        </q-card-actions>

        <q-inner-loading :showing="createLoading">
          <q-spinner-ios size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { QInfiniteScroll, QInput } from 'quasar'
import GuildListCard from 'pages/Guild/components/GuildListCard.vue'

@Component({
  components: {
    GuildListCard
  }
})
export default class GuildList extends Vue {
  public $refs !: {
    infiniteScroll: QInfiniteScroll;
    name: QInput;
  }

  list: any[] = []

  createDialog = false
  name = ''
  createLoading = false

  onLoad (index: any, done: any) {
    this.$axios.get(`guild/list?page=${index}`)
      .then(response => {
        if (index * 10 >= response.data.count) {
          this.$refs.infiniteScroll.stop()
        }
        this.list = this.list.concat(response.data.data)
        done()
      })
  }

  create () {
    if (!this.$refs.name.validate()) return
    this.createLoading = true
    this.$axios.post('guild/create', {
      name: this.name
    })
      .then(() => {
        this.$store.dispatch('user/getInfo')
      })
      .catch(() => {
        this.createLoading = false
      })
  }
}
</script>
