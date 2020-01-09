// Libraries
import Vue from 'vue'
import Vuex, { Store } from 'vuex'

// State
import { stateModel, resourceModel, tombStoneModel } from './state'

// Getters
import { isRoleStaff, isRoleEdit, isRoleView } from '@/store/getters'

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
  getters: {
    isRoleStaff,
    isRoleEdit,
    isRoleView
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
