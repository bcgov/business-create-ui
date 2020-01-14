// Libraries
import Vue from 'vue'
import Vuex, { Store } from 'vuex'

// State
import { stateModel, resourceModel, tombStoneModel } from './state'

// Getters
import { isRoleStaff, isRoleEdit, isRoleView, isEntityType, isTypeBcomp, isTypeCoop,
  isShowBackBtn, isShowReviewConfirmBtn, isShowFilePayBtn, isEnableFilePayBtn, isBusySaving } from '@/store/getters'

// Mutations
import { mutateName, mutateCurrentStep, mutateIsSaving, mutateIsSavingResuming, mutateIsFilingPaying,
  mutateEntityType, mutateResource, mutateKeycloakRoles, mutateAuthRoles } from '@/store/mutations'

// Actions
import { setName, setCurrentStep, setIsSaving, setIsSavingResuming, setIsFilingPaying,
  setEntityType, setResource, setKeyCloakRoles, setAuthRoles } from './actions'

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
    isRoleView,
    isEntityType,
    isTypeBcomp,
    isTypeCoop,
    isShowBackBtn,
    isShowReviewConfirmBtn,
    isShowFilePayBtn,
    isEnableFilePayBtn,
    isBusySaving
  },
  mutations: {
    mutateName,
    mutateCurrentStep,
    mutateIsSaving,
    mutateIsSavingResuming,
    mutateIsFilingPaying,
    mutateEntityType,
    mutateResource,
    mutateKeycloakRoles,
    mutateAuthRoles
  },
  actions: {
    setName,
    setCurrentStep,
    setIsSaving,
    setIsSavingResuming,
    setIsFilingPaying,
    setEntityType,
    setResource,
    setKeyCloakRoles,
    setAuthRoles
  }
})
