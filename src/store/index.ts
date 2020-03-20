// Libraries
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// State
import { stateModel, resourceModel } from './state'

// Getters
import { isRoleStaff, isRoleEdit, isRoleView, isEntityType, isTypeBcomp, isTypeCoop,
  isShowBackBtn, isShowReviewConfirmBtn, isShowFilePayBtn, isEnableFilePayBtn, isBusySaving,
  getFilingId, getBusinessIdentifier, getOfficeAddresses, isApplicationValid, getSteps,
  getMaxStep } from '@/store/getters'

// Mutations
import { mutateCurrentStep, mutateIsSaving, mutateIsSavingResuming, mutateIsFilingPaying,
  mutateResource, mutateKeycloakRoles, mutateAuthRoles, mutateAuthenticated, mutateCurrentDate,
  mutateCertifyStatementResource, mutateCertifyState, mutateBusinessContact, mutateDefineCompanyStepValidity,
  mutateNameRequestState, mutateFilingId, mutateOfficeAddresses, mutateOrgPersonList,
  mutateAddPeopleAndRoleStepValidity, mutateShareClasses, mutateCreateShareStructureStepValidity }
  from '@/store/mutations'

// Actions
import { setCurrentStep, setIsSaving, setIsSavingResuming, setIsFilingPaying, setResource,
  setKeycloakRoles, setAuthRoles, setAuthenticated, setCurrentDate, setCertifyStatementResource, setCertifyState,
  setBusinessContact, setDefineCompanyStepValidity, setNameRequestState, setFilingId, setOfficeAddresses,
  setOrgPersonList, setAddPeopleAndRoleStepValidity, setShareClasses,
  setCreateShareStructureStepValidity } from './actions'

Vue.use(Vuex)

export const store: Store<any> = new Vuex.Store<any>({
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })],
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
    getBusinessIdentifier,
    getOfficeAddresses,
    isApplicationValid,
    getSteps,
    getMaxStep
  },
  mutations: {
    mutateCurrentStep,
    mutateIsSaving,
    mutateIsSavingResuming,
    mutateIsFilingPaying,
    mutateResource,
    mutateKeycloakRoles,
    mutateAuthRoles,
    mutateAuthenticated,
    mutateCurrentDate,
    mutateCertifyStatementResource,
    mutateCertifyState,
    mutateBusinessContact,
    mutateDefineCompanyStepValidity,
    mutateNameRequestState,
    mutateFilingId,
    mutateOfficeAddresses,
    mutateOrgPersonList,
    mutateAddPeopleAndRoleStepValidity,
    mutateShareClasses,
    mutateCreateShareStructureStepValidity
  },
  actions: {
    setCurrentStep,
    setIsSaving,
    setIsSavingResuming,
    setIsFilingPaying,
    setResource,
    setKeycloakRoles,
    setAuthRoles,
    setAuthenticated,
    setCurrentDate,
    setCertifyStatementResource,
    setCertifyState,
    setBusinessContact,
    setDefineCompanyStepValidity,
    setNameRequestState,
    setFilingId,
    setOfficeAddresses,
    setOrgPersonList,
    setAddPeopleAndRoleStepValidity,
    setShareClasses,
    setCreateShareStructureStepValidity
  }
})
