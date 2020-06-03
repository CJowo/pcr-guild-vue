<template>
  <div class="q-pa-md">
    <div class="row items-center">
      <span class="text-h5">{{ title }}</span>
      <q-avatar icon="add_circle_outline" text-color="primary" style="cursor: pointer" @click="createDialog=true">
        <q-tooltip>
          {{ $t('battle.report.createTip') }}
        </q-tooltip>
      </q-avatar>
      <q-avatar icon="info_outline" text-color="primary" style="cursor: pointer" @click="infoDialog=true">
        <q-tooltip>
          {{ $t('battle.report.infoTip') }}
        </q-tooltip>
      </q-avatar>
    </div>

     <q-infinite-scroll ref="infiniteScroll" @load="onLoad" :offset="50">
      <div>
        <div v-for="(val, key) in reports" :key="key">
          <div class="text-h6 text-center">{{ key }}</div>
          <div class="q-pa-md row items-start q-gutter-md justify-center justify-sm-start items-start">
            <Report v-for="(item, index) in val" :key="index" v-model="val[index]" :editable="operater" @delete="val.splice(index, 1)" />
          </div>
        </div>
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>

    <q-dialog v-model="createDialog" persistent @hide="refreshForm" >
      <q-card style="width: 300px" @keydown.enter="create">
        <q-card-section class="q-gutter-y-md">
          <q-select v-if="operater" :options="userOptions" v-model="selectedUser" />
          <q-input v-model.number="form.value" type="number" :label="$t('battle.report.value')" />
          <q-select
            v-model="form.index"
            :label="$t('battle.report.boss')"
            :options="[1, 2, 3, 4, 5]"
          />
          <q-input v-model.number="form.round" type="number" :label="$t('battle.report.round')" :rules="[val => val > 0, val => val < 27]" />
          <q-field :label="$t('battle.report.finish')" v-model.number="form.finish">
            <template v-slot:control>
              <div class="self-center full-width no-outline">
                {{ form.finish }}
                <q-popup-proxy>
                  <q-date v-model="form.finish" mask="YYYY-MM-DD" :label="$t('battle.report.finish')" />
                </q-popup-proxy>
              </div>
            </template>
          </q-field>
          <q-input v-model="form.desc" :label="$t('battle.report.desc')" :rules="[val => val.length < 32]"/>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" v-close-popup />
          <q-btn color="primary" label="OK" @click="create" />
        </q-card-actions>

        <q-inner-loading :showing="loading">
          <q-spinner-ios size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
    </q-dialog>

    <Today v-model="infoDialog" v-if="infoDialog" />

    <q-inner-loading :showing="loading">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { QInfiniteScroll } from 'quasar'
import Report from 'pages/Battle/components/Report.vue'
import Today from 'pages/Battle/components/Today.vue'

@Component({
  components: {
    Report,
    Today
  }
})
export default class BattleInfo extends Vue {
  public $refs !: {
    infiniteScroll: QInfiniteScroll;
  }

  loading = false
  createDialog = false
  infoDialog = false
  title = ''

  selectedUser = {
    label: this.user.nickname + `(${this.user.username})`,
    value: this.user.username
  }

  form = {
    username: '',
    value: 0,
    round: 1,
    index: 1,
    finish: (() => {
      let date = new Date()
      date.setTime(date.getTime() - 18000000)
      return [date.getFullYear(), (date.getMonth() + 1 + '').padStart(2, '0'), (date.getDate() + '').padStart(2, '0')].join('-')
    })(),
    desc: ''
  }

  @Watch('selectedUser')
  onChange (val: any) {
    this.form.username = val.value
  }

  reports: any = {}

  get user () { return this.$store.state.user.data }

  users: any = []

  get operater () {
    if (this.users.operaters === undefined) return false
    for (let i in this.users.operaters) {
      if (this.users.operaters[i].username === this.user.username) return true
    }
    return false
  }

  get userOptions () {
    let temp: any = []
    for (let i in this.users.operaters) {
      temp.push({
        label: this.users.operaters[i].nickname + `(${this.users.operaters[i].username})`,
        value: this.users.operaters[i].username
      })
    }
    for (let i in this.users.users) {
      temp.push({
        label: this.users.users[i].nickname + `(${this.users.users[i].username})`,
        value: this.users.users[i].username
      })
    }
    return temp
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

  created () {
    this.load()
    this.$axios.get('battle/info')
      .then(response => {
        this.title = response.data.title
      })
  }

  onLoad (index: any, done: any) {
    this.$axios.get(`report/list?page=${index}`)
      .then(response => {
        if (index * 10 >= response.data.count) {
          this.$refs.infiniteScroll.stop()
        }
        for (let i in response.data.data) {
          let key = response.data.data[i].finish
          if (this.reports[key] === undefined) {
            this.$set(this.reports, key, [])
          }
          this.reports[key].push(response.data.data[i])
        }
        done()
      })
  }

  create () {
    this.loading = true
    this.$axios.post('report/create', this.form)
      .then(() => {
        console.log(123)
        this.reports = {}
        this.$refs.infiniteScroll.reset()
        this.$refs.infiniteScroll.resume()
        this.$refs.infiniteScroll.trigger()
        this.createDialog = false
      })
      .finally(() => {
        this.loading = false
      })
  }

  refreshForm () {
    this.form.value = 0
    this.form.desc = ''
  }
}
</script>
