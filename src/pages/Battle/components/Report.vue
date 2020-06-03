<template>
  <q-card class="no-wrap" style="width: 350px">
    <q-card-section>
      <div class="row justify-around items-center q-gutter-xs no-wrap">
        <span class="text-body1 q-pa-xs" style="flex-grow: 1">
          {{ report.value }}
        </span>
        <q-chip outline color="primary" style="width: 120px; flex-shrink: 0">
          <q-avatar outline color="primary" text-color="white">{{ String.fromCharCode(64 + report.round) }}{{ report.index }}</q-avatar>
          {{ report.finish }}
        </q-chip>
        <q-chip outline color="primary" text-color="white" icon="account_circle" style="cursor: pointer; width: 100px" >
          <span class="ellipsis">{{ report.user.nickname }}</span>
          <q-popup-proxy>
              <UserCard :user="report.user"/>
          </q-popup-proxy>
        </q-chip>
      </div>
      <div class="q-pt-xs q-px-xs text-caption text-grey">
        {{ report.desc }}
      </div>
    </q-card-section>

    <q-card-actions class="row justify-around" v-if="editable">
      <q-btn flat :label="$t('battle.report.delete')" color="negative" @click="deleteReport" />
      <q-btn flat :label="$t('battle.report.edit')" color="primary" @click="editShow" />
    </q-card-actions>

    <q-dialog v-model="editDialog" persistent>
      <q-card style="width: 300px" @keydown.enter="edit">
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
          <q-btn color="primary" label="OK" @click="edit" />
        </q-card-actions>

        <q-inner-loading :showing="loading">
          <q-spinner-ios size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from 'vue-property-decorator'
import UserCard from 'components/UserCard.vue'

@Component({
  components: {
    UserCard
  }
})
export default class Report extends Vue {
  @Model('input') report !: any
  @Prop({ default: false }) editable !: boolean
  loading = false
  editDialog = false

  form = {
    id: '',
    value: 0,
    round: 1,
    index: 1,
    finish: '0000-00-00',
    desc: ''
  }

  editShow () {
    Object.assign(this.form, this.report)
    this.editDialog = true
  }

  edit () {
    this.loading = true
    this.$axios.post('report/edit', this.form)
      .then(() => {
        this.$emit('input', this.form)
        this.editDialog = false
      })
      .finally(() => {
        this.loading = false
      })
  }

  deleteReport () {
    this.$q.dialog({
      title: 'Delete Report',
      message: `${this.report.value} - ${this.report.finish}`,
      cancel: true,
      persistent: true
    }).onOk(() => {
      this.loading = true
      this.$axios.post('report/delete', {
        id: this.report.id
      })
        .then(() => {
          this.$emit('delete')
        })
        .finally(() => {
          this.loading = false
        })
    })
  }
}
</script>
