<template>
  <div class="row justify-center items-center">
      <q-input
        lazy-rules
        autofocus
        filled
        v-model="password"
        :rules="[val => !!val]"
        :label="$t('admin.password')"
        class="q-pa-none q-mt-md"
        style="width: 300px"
        type="password"
        @keydown.enter="validate"
      />
      <q-btn :label="$t('admin.validate')" color="primary" class="q-ml-md q-mt-md" @click="validate"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class AdminValidate extends Vue {
  loading = false
  password = ''

  validate () {
    if (this.password.length === 0) return
    this.loading = true
    this.$axios.post('admin/validate', {
      password: this.password
    })
      .then(() => {
        this.$store.commit('admin/update', this.password)
        this.$router.replace('/admin/detail')
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>
