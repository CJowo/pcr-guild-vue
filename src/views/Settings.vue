<template>
  <el-button type="danger" @click="$router.push('/logout')">{{ $t('login.logout') }}</el-button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Settings extends Vue {

}
</script>
