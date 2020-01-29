// Libraries
import Vue from 'vue'
import Vuex, { Store } from 'vuex'

// State
import { stateModel, resourceModel } from './state'

// Getters
import { isRoleStaff, isRoleEdit, isRoleView, isEntityType, isTypeBcomp, isTypeCoop,
  isShowBackBtn, isShowReviewConfirmBtn, isShowFilePayBtn, isEnableFilePayBtn, isBusySaving,
  getFilingId, getBusinessIdentifier } from '@/store/getters'

// Mutations
import { mutateCurrentStep, mutateIsSaving, mutateIsSavingResuming, mutateIsFilingPaying,
  mutateResource, mutateKeycloakRoles, mutateAuthRoles, mutateCurrentDate, mutateCertifyStatementResource,
  mutateCertifyState, mutateBusinessContact, mutateDefineCompanyStepValidity, mutateNameRequestState,
  mutateFilingId } from '@/store/mutations'

// Actions
import { setCurrentStep, setIsSaving, setIsSavingResuming, setIsFilingPaying, setResource,
  setKeyCloakRoles, setAuthRoles, setCurrentDate, setCertifyStatementResource, setCertifyState, setBusinessContact,
  setDefineCompanyStepValidity, setNameRequestState, setFilingId } from './actions'

Vue.use(Vuex)

export const store: Store<any> = new Vuex.Store<any>({
  state: {
    stateModel,
    resourceModel
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
    isBusySaving,
    getFilingId,
    getBusinessIdentifier
  },
  mutations: {
    mutateCurrentStep,
    mutateIsSaving,
    mutateIsSavingResuming,
    mutateIsFilingPaying,
    mutateResource,
    mutateKeycloakRoles,
    mutateAuthRoles,
    mutateCurrentDate,
    mutateCertifyStatementResource,
    mutateCertifyState,
    mutateBusinessContact,
    mutateDefineCompanyStepValidity,
    mutateNameRequestState,
    mutateFilingId
  },
  actions: {
    setCurrentStep,
    setIsSaving,
    setIsSavingResuming,
    setIsFilingPaying,
    setResource,
    setKeyCloakRoles,
    setAuthRoles,
    setCurrentDate,
    setCertifyStatementResource,
    setCertifyState,
    setBusinessContact,
    setDefineCompanyStepValidity,
    setNameRequestState,
    setFilingId
  }
})
