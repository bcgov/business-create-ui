// Libraries
import Vue from 'vue'
import Vuex, { Store } from 'vuex'

// State
import { stateModel, resourceModel, tombStoneModel } from './state'

// Getters
import { isRoleStaff, isRoleEdit, isRoleView, isEntityType, isTypeBcomp, isTypeCoop,
  isShowBackBtn, isShowReviewConfirmBtn, isShowFilePayBtn, isEnableFilePayBtn, isBusySaving } from '@/store/getters'

// Mutations
import { mutateCurrentStep, mutateIsSaving, mutateIsSavingResuming, mutateIsFilingPaying,
  mutateEntityType, mutateResource, mutateKeycloakRoles, mutateAuthRoles,
  mutateCurrentDate, mutateCertifyStatementResource, mutateCertifyState,
  mutateBusinessContact, mutateDefineCompanyStepValidity, mutateOfficeAddresses } from '@/store/mutations'

// Actions
import { setCurrentStep, setIsSaving, setIsSavingResuming, setIsFilingPaying,
  setEntityType, setResource, setKeyCloakRoles, setAuthRoles, setCurrentDate,
  setCertifyStatementResource, setCertifyState, setBusinessContact,
  setDefineCompanyStepValidity, setOfficeAddresses } from './actions'

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
    mutateCurrentStep,
    mutateIsSaving,
    mutateIsSavingResuming,
    mutateIsFilingPaying,
    mutateEntityType,
    mutateResource,
    mutateKeycloakRoles,
    mutateAuthRoles,
    mutateCurrentDate,
    mutateCertifyStatementResource,
    mutateCertifyState,
    mutateBusinessContact,
    mutateDefineCompanyStepValidity,
    mutateOfficeAddresses
  },
  actions: {
    setCurrentStep,
    setIsSaving,
    setIsSavingResuming,
    setIsFilingPaying,
    setEntityType,
    setResource,
    setKeyCloakRoles,
    setAuthRoles,
    setCurrentDate,
    setCertifyStatementResource,
    setCertifyState,
    setBusinessContact,
    setDefineCompanyStepValidity,
    setOfficeAddresses
  }
})
