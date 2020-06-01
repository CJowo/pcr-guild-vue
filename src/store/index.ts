import { store } from 'quasar/wrappers'
import Vuex from 'vuex'
import user from './user'
import admin from './admin'

export interface StoreInterface {
  example: unknown;
}

export default store(function ({ Vue }) {
  Vue.use(Vuex)

  const Store = new Vuex.Store<StoreInterface>({
    modules: {
      user,
      admin
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV
  })

  return Store
})
