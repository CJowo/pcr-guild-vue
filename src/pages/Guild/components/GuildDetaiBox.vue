<template>
  <div>
    <q-btn class="relative q-ma-sm" :label="$t('guild.guildDetailBox.filter')" @click="dialog=true">
      <q-badge color="red" floating v-if="rules.length > 0">{{ rules.length }}</q-badge>
    </q-btn>
    <span v-for="item in boxes" :key="item.username">
      <GuildDetailBoxCard v-if="filter(item)" :item="item" />
    </span>

    <q-dialog v-model="dialog" maximized>
      <q-card>
        <q-card-section class="row justify-between">
          <span class="text-h6">
            {{ $t('guild.guildDetailBox.filter') }}
            <q-avatar icon="add_circle_outline" text-color="primary" style="cursor: pointer" @click="addDialog=true" />
          </span>
          <q-btn flat icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-y-md">
          <q-card v-for="(rule, index) in rules" :key="index">
            <q-card-section class="text-body1">
              {{ $t('guild.guildDetailBox.'+rule.mode) }}
              <span v-if="rule.inverse">{{ $t('guild.guildDetailBox.inverse') }}</span>
            </q-card-section>
            <q-card-section class="row justify-sm-start text-body1 q-gutter-y-sm">
              <div v-for="i in rule.characters" :key="i.name">
                <Character :name="i.name" :size="32" />
                {{ $t('character.star') }}({{ i.star.min }}, {{ i.star.max }})
                {{ $t('character.rank') }}({{ i.rank.min }}, {{ i.rank.max }})
                {{ $t('character.exclusive') }}({{ i.exclusive.min }}, {{ i.exclusive.max }})
              </div>
            </q-card-section>

            <q-card-actions class="row justify-around">
              <q-btn flat color="negative" @click="rules.splice(index, 1)" label="Remove" />
              <q-btn flat color="primary" @click="editRule(rule)" label="Edit"/>
            </q-card-actions>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addDialog" persistent @hide="addDialogHide">
      <q-card>
        <q-card-section>
          <q-btn-toggle
            v-model="form.mode"
            toggle-color="primary"
            :options="[
              {label: $t('guild.guildDetailBox.and'), value: 'and'},
              {label: $t('guild.guildDetailBox.or'), value: 'or'}
            ]"
          />
          <q-toggle v-model="form.inverse" :label="$t('guild.guildDetailBox.inverse')" />
        </q-card-section>

        <q-card-section class="row q-gutter-xs items-start">
          <Character :name="item" v-for="item in characters" :key="item.name" @click="detailEdit(form.characters[item])" />
          <q-img src="~/assets/image/add.png" style="width: 64px" @click="selectVisiable=true" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label='Cancel' v-close-popup />
          <q-btn label='OK' color="primary" v-close-popup @click="add" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="selectVisiable">
      <q-card style="width: 700px">
        <q-card-section>
          <CharacterSelect v-model="characters" :multiple="true" :disabled="[]" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label='OK' color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="detailDialog" >
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">{{ $t('character.'+character.name) }}</div>
        </q-card-section>

        <q-card-section>
          <q-field :label="$t('character.star')">
            <q-range
              label-always
              v-model="character.star"
              :min="1"
              :max="6"
              color="primary"
            />
          </q-field>
          <q-field :label="$t('character.rank')">
            <q-range
              label-always
              v-model="character.rank"
              :min="1"
              :max="20"
              color="primary"
            />
          </q-field>
          <q-field :label="$t('character.exclusive')">
            <q-range
              label-always
              v-model="character.exclusive"
              :min="0"
              :max="300"
              color="primary"
            />
          </q-field>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-inner-loading :showing="loading">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import Character from 'components/Character.vue'
import CharacterSelect from 'components/CharacterSelect.vue'
import UserCard from 'components/UserCard.vue'
import GuildDetailBoxCard from 'pages/Guild/components/GuildDetailBoxCard.vue'

@Component({
  components: {
    CharacterSelect,
    Character,
    UserCard,
    GuildDetailBoxCard
  }
})
export default class GuildDetailBox extends Vue {
  loading = false
  boxes: any = []
  rules: any = []
  dialog = false
  addDialog = false
  selectVisiable = false
  detailDialog = false
  edit = false

  characters: any = []
  character: any = {
    name: '',
    rank: {
      max: 20,
      min: 1
    },
    star: {
      max: 6,
      min: 1
    },
    exclusive: {
      max: 300,
      min: 0
    }
  }

  @Watch('characters', { deep: true })
  onChange (val: any) {
    for (let key in this.form.characters) {
      if (val.indexOf(key) === -1) delete this.form.characters[key]
    }
    for (let i in val) {
      if (this.form.characters[val[i]] === undefined) {
        this.form.characters[val[i]] = {
          name: val[i],
          rank: {
            max: 20,
            min: 1
          },
          star: {
            max: 6,
            min: 1
          },
          exclusive: {
            max: 300,
            min: 0
          }
        }
      }
    }
  }

  form: any = {
    characters: {},
    mode: 'and',
    inverse: false
  }

  created () {
    this.loading = true
    this.$axios.get('guild/boxes')
      .then(response => {
        this.boxes = response.data
      })
      .finally(() => {
        this.loading = false
      })
  }

  filter (item: any) {
    for (let i in this.rules) {
      switch (this.rules[i].mode) {
        case 'and':
          if (this.and(this.rules[i], item)) {
            if (this.rules[i].inverse) return false
          } else {
            if (!this.rules[i].inverse) return false
          }
          break
        case 'or':
          if (this.or(this.rules[i], item)) {
            if (this.rules[i].inverse) return false
          } else {
            if (!this.rules[i].inverse) return false
          }
          break
      }
    }
    return true
  }

  and (rule: any, item: any) {
    for (let i in rule.characters) {
      let character: any = null
      for (let j in item.characters) {
        if (item.characters[j].name === i) {
          character = item.characters[j]
          break
        }
      }
      if (character === null) return false
      if (character.star < rule.characters[i].star.min ||
      character.star > rule.characters[i].star.max) return false
      if (character.rank < rule.characters[i].rank.min ||
      character.rank > rule.characters[i].rank.max) return false
      if (character.exclusive < rule.characters[i].exclusive.min ||
        character.exclusive > rule.characters[i].exclusive.max) return false
    }
    return true
  }

  or (rule: any, item: any) {
    for (let i in rule.characters) {
      let character: any = null
      for (let j in item.characters) {
        if (item.characters[j].name === i) {
          character = item.characters[j]
          break
        }
      }
      if (character !== null &&
        character.star >= rule.characters[i].star.min &&
        character.star <= rule.characters[i].star.max &&
        character.rank >= rule.characters[i].rank.min &&
        character.rank <= rule.characters[i].rank.max &&
        character.exclusive >= rule.characters[i].exclusive.min &&
        character.exclusive <= rule.characters[i].exclusive.max) return true
    }
    return false
  }

  detailEdit (item: any) {
    this.character = item
    this.detailDialog = true
  }

  add () {
    if (this.edit) return
    this.rules.push(this.form)
    this.form = {
      characters: {},
      mode: 'and',
      inverse: false
    }
  }

  editRule (rule: any) {
    this.form = rule
    this.characters = []
    for (let i in rule.characters) {
      this.characters.push(i)
    }
    this.edit = true
    this.addDialog = true
  }

  addDialogHide () {
    this.edit = false
    this.form = {
      characters: {},
      mode: 'and',
      inverse: false
    }
    this.characters = []
  }
}
</script>
