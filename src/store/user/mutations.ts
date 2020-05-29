import { MutationTree } from 'vuex'
import { ExampleStateInterface } from './state'

const mutation: MutationTree<ExampleStateInterface> = {
  update (state, data: any) {
    state.data = data
  }
}

export default mutation
