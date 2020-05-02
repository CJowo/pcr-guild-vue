import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueI18n from 'vue-i18n'

import Http from '@/utils/http'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueI18n)
Vue.use(Http)

const i18n = new VueI18n({
  locale: 'zh-hans',
  messages: {
    'zh-hans': require('@/assets/locales/zh-hans.json')
  }
})

window.i18n = i18n

declare global {
  interface Window {
    i18n: VueI18n;
  }
}

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
