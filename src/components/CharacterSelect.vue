<template>
  <div class="q-gutter-sm">
    <div>
      <q-btn-toggle
        v-model="station"
        unelevated
        rounded
        toggle-color="primary"
        :options="[
          {value: null, slot: 'all'},
          {value: 2, slot: 's2'},
          {value: 1, slot: 's1'},
          {value: 0, slot: 's0'}
        ]"
      >
        <template v-slot:all>
          <span class="text-no-wrap">{{ $t('characterSelect.all') }}</span>
        </template>

        <template v-slot:s2>
          <span class="text-no-wrap">
            <q-img src="~/assets/image/s2.png" class="charater-img" :ratio="1"/>
            <span class="q-ml-xs">{{ $t('characterSelect.s2') }}</span>
          </span>
        </template>

        <template v-slot:s1>
          <span class="text-no-wrap">
            <q-img src="~/assets/image/s1.png" class="charater-img" :ratio="1"/>
            <span class="q-ml-xs">{{ $t('characterSelect.s1') }}</span>
          </span>
        </template>

        <template v-slot:s0>
          <span class="text-no-wrap">
            <q-img src="~/assets/image/s0.png" class="charater-img" :ratio="1"/>
            <span class="q-ml-xs">{{ $t('characterSelect.s0') }}</span>
          </span>
        </template>
      </q-btn-toggle>
    </div>
    <div class="q-gutter-xs row">
      <Character
        v-for="(val, key) in characters"
        :key="key" :class="{hidden: !filter(val), 'order-last': disabled.indexOf(key)!==-1}"
        :name="key" :disabled="disabled.indexOf(key)!==-1" :dimmed="_selected.indexOf(key)===-1"
        @click="click(key)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop } from 'vue-property-decorator'
import Character from 'components/Character.vue'
import characters from 'assets/js/characters.js'

@Component({
  components: {
    Character
  }
})
export default class CharacterSelect extends Vue {
  characters = characters
  visible = true

  @Model('change') selected !: any
  @Prop({ type: Boolean, default: false }) multiple !: boolean
  @Prop({ type: Array, default: [] }) disabled !: string[]

  private get _selected (): string[] { return [].concat(this.selected) }

  station: null | number = null

  filter (val: any) {
    if (this.station === null || val.station === this.station) return true
  }

  click (key: string) {
    if (this.multiple) {
      let index = this.selected.indexOf(key)
      if (index === -1) this.$emit('change', this._selected.concat(key))
      else {
        this._selected.splice(index, 1)
        this.$emit('change', this._selected)
      }
    } else {
      this.$emit('change', key)
    }
  }
}
</script>

<style lang="sass" scoped>
.charater-img
  width: 24px

@media (max-width: $breakpoint-xs-max)
  .charater-img
    width: 16px
    font-size: 12px
</style>
