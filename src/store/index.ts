// Libraries
import Vue from 'vue'
import Vuex, { Store } from 'vuex'

// State
import { stateModel, resourceModel, tombStoneModel } from './state'

// Actions
import { setName, setResource, setKeyCloakRoles, setAuthRoles } from './actions'

// Mutations
import { mutateName, mutateResource, mutateKeycloakRoles, mutateAuthRoles } from '@/store/mutations'

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
    mutateKeycloakRoles,
    mutateAuthRoles
  },
  actions: {
    setName,
    setResource,
    setKeyCloakRoles,
    setAuthRoles
  }
})
