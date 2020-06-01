<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          {{ $t('app.title') }}
        </q-toolbar-title>

        <q-btn
          flat
          dense
          no-caps
          icon="account_circle"
          :label="$store.state.user.data.nickname"
        >
          <q-popup-proxy>
            <UserInfo />
          </q-popup-proxy>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          {{ $t('app.menu') }}
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink'
import UserInfo from 'components/UserInfo.vue'

export default {
  name: 'MainLayout',

  components: {
    EssentialLink,
    UserInfo
  },

  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: this.$t('app.box'),
          caption: '',
          icon: 'inbox',
          link: '/#/box'
        },
        {
          title: this.$t('app.guild'),
          caption: '',
          icon: 'house',
          link: '/#/guild'
        },
        {
          title: this.$t('app.battle'),
          caption: '',
          icon: 'gamepad',
          link: '/#/battle'
        },
        {
          title: this.$t('app.library'),
          caption: '',
          icon: 'library_books',
          link: '/#/library',
          disabled: true
        },
        {
          title: this.$t('app.admin'),
          caption: '',
          icon: 'img:statics/image/icons/admin_panel_settings.png',
          link: '/#/admin'
        }
      ]
    }
  }
}
</script>
