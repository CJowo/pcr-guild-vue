import { MutationTree } from 'vuex'
import { ExampleStateInterface } from './state'

const mutation: MutationTree<ExampleStateInterface> = {
  update (state, password: string) {
    state.password = password
  }
}

export default mutation
