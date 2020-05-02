<template>
  <el-container style="height: 100%">
    <el-header class="header">
      <span class="title">{{ $t('title') }}</span>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <el-menu
          class="menu" default-active="-1"
          :router="true"
          :collapse="collapse" :collapse-transition="false"
          :style="{width: collapse ? 'auto' : '12em'}"
        >
          <el-menu-item index="" @click="collapse = !collapse">
            <i :class="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" />
            <span>{{ $t('menu.collapse') }}</span>
          </el-menu-item>
          <el-menu-item index="box">
            <i class="el-icon-s-grid" />
            <span>{{ $t('menu.box') }}</span>
          </el-menu-item>
          <el-menu-item index="member">
            <i class="el-icon-user" />
            <span>{{ $t('menu.member') }}</span>
          </el-menu-item>
          <el-menu-item index="order">
            <i class="el-icon-tickets" />
            <span>{{ $t('menu.order') }}</span>
          </el-menu-item>
          <el-menu-item index="settings" style="position: absolute; bottom: 0px; width: 100%;">
            <i class="el-icon-setting" />
            <span>{{ $t('menu.setting') }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  collapse = false

  get title () { return this.$t('title') }
  @Watch('title', { immediate: true })
  onTitleChange (newTitle: string) {
    document.title = newTitle
  }
}
</script>

<style>
html,
body {
  position: relative;
  height: 100vh;
  width: 100vw;
  margin: 0;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
</style>

<style scoped>
.header {
  background-color: #409EFF;
}

.title {
  color: #FFF;
  font-size: 20px;
  line-height: 60px;
}

.menu {
  height: 100%;
  overflow: hidden;
}
</style>
