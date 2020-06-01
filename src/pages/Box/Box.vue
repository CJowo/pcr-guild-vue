<template>
  <q-page class="relative q-pa-md">
    <div v-if="user.username" class="row q-gutter-xs items-start">
      <Character
        :name="item.name" :star="item.star" :exclusive="item.exclusive"
        :rank="item.rank" v-for="item in user.characters"
        :key="item.name" @click="editShow(item)"
      />
      <q-img src="~/assets/image/add.png" style="width: 64px" @click="selectVisiable=true"/>
    </div>

    <q-dialog v-model="selectVisiable">
      <q-card style="width: 700px">
        <q-card-section>
          <CharacterSelect :disabled="disabled" v-model="character" :multiple="false"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editVisiable">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('character.'+this.form.name) }}</div>
        </q-card-section>

        <q-card-section>
          <q-rating v-model="form.star" size="2em" :max="6" icon="star_border" icon-selected="star" />
          <q-input v-model.number="form.rank" type="number" :label="$t('character.rank')" />
          <q-input v-model.number="form.exclusive" type="number" :label="$t('character.exclusive')" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="DELETE" color="negative" v-close-popup @click="characterDelete" />
          <q-btn flat label="OK" color="primary" v-close-popup @click="edit" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-inner-loading :showing="loading">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import Character from 'components/Character.vue'
import CharacterSelect from 'components/CharacterSelect.vue'

@Component({
  components: {
    Character,
    CharacterSelect
  }
})
export default class Box extends Vue {
  loading = false

  selectVisiable = false
  editVisiable = false
  get user () { return this.$store.state.user.data }
  get disabled () {
    return this.user.characters.map((item: any) => item.name)
  }

  character = ''
  form = {
    id: '',
    name: '',
    rank: 1,
    star: 1,
    exclusive: 0
  }

  @Watch('character')
  onChangeCharacters (val: string) {
    if (this.character === '') return
    this.selectVisiable = false
    this.loading = true
    this.$axios.post('character/create', {
      name: this.character
    })
      .then(() => {
        return this.$store.dispatch('user/getInfo')
      })
      .finally(() => {
        this.character = ''
        this.loading = false
      })
  }

  editShow (item: any) {
    Object.assign(this.form, item)
    this.editVisiable = true
  }

  edit () {
    this.loading = true
    this.$axios.post('character/edit', this.form)
      .then(() => {
        return this.$store.dispatch('user/getInfo')
      })
      .finally(() => {
        this.loading = false
      })
  }

  characterDelete () {
    this.loading = true
    this.$axios.post('character/delete', {
      id: this.form.id
    })
      .then(() => {
        return this.$store.dispatch('user/getInfo')
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>
