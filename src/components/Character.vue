<template>
  <div style="display: inline-block; border-radius: 6px" class="overflow-hidden" @click="click">
    <q-img
      :ratio="1" :src="`/statics/image/characters/${name}.png`"
      :style="{height: size+'px', width: size+'px'}"
      :class="{dimmed: dimmed, disabled: disabled}"
    />
    <div
      v-if="size>48 && rank>0"
      class="absolute"
      :style="{'margin-top': -size+'px', 'font-size': size/5+'px', 'font-weight': 500}"
      style="text-shadow: #fff 1px 0 0, #fff 0 1px 0, #fff -1px 0 0, #fff 0 -1px 0"
    >
      RANK {{ rank }}
    </div>
    <div :style="{width: size+'px', 'margin-top': -size/6+'px'}" class="row justify-center absolute">
      <img src="~/assets/image/star.png" v-for="i in Array(star)" :key="i" :width="size/6+'px'" :height="size/6+'px'" />
    </div>
    <q-tooltip>
      {{ $t('character.'+name) }}
      <span v-if="star>0"><br />{{ $t('character.star') + ': ' + star }}</span>
      <span v-if="rank>0"><br />{{ $t('character.rank') + ': ' + rank }}</span>
      <span v-if="exclusive>0"><br />{{ $t('character.exclusive') + ': ' + exclusive }}</span>
    </q-tooltip>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Character extends Vue {
  @Prop({ type: String }) name !: string
  @Prop({ type: Number, default: 64 }) size !: number
  @Prop({ type: Number, default: 0 }) star !: number
  @Prop({ type: Number, default: 0 }) rank !: number
  @Prop({ type: Number, default: 0 }) exclusive !: number
  @Prop({ type: Boolean, default: false }) disabled !: boolean
  @Prop({ type: Boolean, default: false }) dimmed !: boolean

  click () {
    if (!this.disabled) this.$emit('click')
  }
}
</script>
