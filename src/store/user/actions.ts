import { ActionTree } from 'vuex'
import { StoreInterface } from '../index'
import { ExampleStateInterface } from './state'
import axios from 'axios'

const actions: ActionTree<ExampleStateInterface, StoreInterface> = {
  getInfo ({ commit }) {
    axios.get('user/info')
      .then(response => {
        commit('update', response.data)
      })
  }
}

export default actions
