<template>
  <q-dialog
    ref="dialog"
    persistent
    maximized
  >
    <q-card>
      <q-card-section class="row justify-between">
        <q-space />
        <q-btn flat icon="close" v-close-popup />
      </q-card-section>

      <q-card-section class="row justify-around q-gutter-lg" v-if="characters.length===0">
        <q-file label="File" v-model="file" style="width: 300px">
          <template v-slot:append>
            <q-btn :label="$t('box.upload')" @click="upload" v-if="file"/>
          </template>
        </q-file>
        <div style="width: 300px" class="text-grey-8">
          <pre style="white-space: pre-wrap;">{{ $t('box.imageGuide') }}</pre>
          <q-img src="/statics/image/boxImageExample.png" />
        </div>
      </q-card-section>

      <q-card-section v-if="characters.length!==0">
        <span class="text-grey-8">{{ $t('box.imageTip') }}</span>
        <div class="row q-gutter-xs items-start">
          <Character
            :name="item.name" :star="item.star" :exclusive="item.exclusive"
            :rank="item.rank" v-for="item in characters"
            :key="item.name" @click="edit(item)"
          />
        </div>
        <div class="row justify-between">
          <q-space />
          <q-btn :label="$t('box.update')" color="primary" @click="update" />
        </div>
      </q-card-section>

      <q-dialog v-model="editVisiable">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ $t('character.'+form.name) }}</div>
          </q-card-section>

          <q-card-section>
            <q-rating v-model="form.star" size="2em" :max="6" icon="star_border" icon-selected="star" />
            <q-input v-model.number="form.rank" type="number" :label="$t('character.rank')" />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="DELETE" color="negative" v-close-popup @click="del(form)" />
            <q-btn flat label="OK" color="primary" v-close-popup @click="edit" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-inner-loading :showing="loading">
        <q-spinner-ios size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { QDialog } from 'quasar'
import Character from 'components/Character.vue'

@Component({
  components: {
    Character
  }
})
export default class BoxImage extends Vue {
  public $refs !: {
    dialog: QDialog;
  }

  loading = false
  editVisiable = false
  file: File|null = null
  characters: any[] = []
  form = {
    name: '',
    rank: 1,
    star: 1
  }

  upload () {
    this.loading = true
    let data = new FormData()
    data.append('file', this.file as File)
    this.$axios.post('character/image', data,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
      .then(response => {
        if (response.data.length === 0) {
          this.$q.notify({
            message: this.$t('box.imageNoResult') as string,
            color: 'negative',
            position: 'top'
          })
        } else {
          this.characters = response.data
        }
      })
      .finally(() => {
        this.loading = false
      })
  }

  update () {
    this.loading = true
    this.$axios.post('character/update', this.characters)
      .then(response => {
        this.$q.notify({
          message: `${response.data.s.length} successes, ${response.data.f.length} failures`,
          position: 'top'
        })
        this.$store.dispatch('user/getInfo')
        this.hide()
      })
      .finally(() => {
        this.loading = false
      })
  }

  edit (item: any) {
    this.form = item
    this.editVisiable = true
  }

  del (item: any) {
    for (let i = 0; i < this.characters.length; i++) {
      if (this.characters[i] === item) {
        this.characters.splice(i, 1)
        break
      }
    }
  }

  show () {
    this.$refs.dialog.show()
  }

  hide () {
    this.$refs.dialog.hide()
  }
}
</script>
