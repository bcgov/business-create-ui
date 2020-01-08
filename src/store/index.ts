// Libraries
import Vue from 'vue'
import Vuex, { Store } from 'vuex'

// State
import { stateModel, resourceModel, tombStoneModel } from './state'

// Actions
import { setName, setResource, setTombStone } from './actions'

// Mutations
import { mutateName, mutateResource, mutateTombStone } from '@/store/mutations'

Vue.use(Vuex)

export const store: Store<any> = new Vuex.Store<any>({
  state: {
    stateModel,
    resourceModel,
    tombStoneModel
  },
  mutations: {
    mutateName,
    mutateResource,
    mutateTombStone
  },
  actions: {
    setName,
    setResource,
    setTombStone
  }
})
