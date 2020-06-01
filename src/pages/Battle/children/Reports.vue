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
      <div class="q-pa-md row items-start q-gutter-md justify-center justify-sm-start items-start">
        <Report v-for="(item, index) in reports" :key="index" :report="item" />
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>

    <q-dialog v-model="createDialog" persistent>
      <q-card style="width: 300px" @keydown.enter="create">
        <q-card-section class="q-gutter-y-md">
          <q-input v-model.number="form.value" type="number" :label="$t('battle.report.value')" />
          <q-select
            v-model="form.index"
            :label="$t('battle.report.boss')"
            :options="[1, 2, 3, 4, 5]"
          />
          <q-input v-model.number="form.round" type="number" :label="$t('battle.report.round')" :rules="[val => val > 0]" />
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

    <Today v-model="infoDialog" />

    <q-inner-loading :showing="loading">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
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

  form = {
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

  reports: any = []

  created () {
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
        this.reports = this.reports.concat(response.data.data)
        done()
      })
  }

  create () {
    this.loading = true
    this.$axios.post('report/create', this.form)
      .then(() => {
        this.reports = []
        this.$refs.infiniteScroll.reset()
        this.$refs.infiniteScroll.resume()
        this.createDialog = false
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>
