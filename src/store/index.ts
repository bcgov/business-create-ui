// Libraries
import Vue from 'vue'
import Vuex, { Store } from 'vuex'

// State
import { stateModel, resourceModel } from './state'

// Getters
import { isRoleStaff, isRoleEdit, isRoleView, isEntityType, isTypeBcomp, isTypeCoop,
  isShowBackBtn, isShowReviewConfirmBtn, isShowFilePayBtn, isEnableFilePayBtn, isBusySaving,
  getFilingId, getBusinessIdentifier, getOfficeAddresses } from '@/store/getters'

// Mutations
import { mutateCurrentStep, mutateIsSaving, mutateIsSavingResuming, mutateIsFilingPaying,
  mutateResource, mutateKeycloakRoles, mutateAuthRoles, mutateCurrentDate, mutateCertifyStatementResource,
  mutateCertifyState, mutateBusinessContact, mutateDefineCompanyStepValidity, mutateNameRequestState,
  mutateFilingId, mutateOfficeAddresses, mutateRegisteredOffice, mutateRecordsOffice } from '@/store/mutations'

// Actions
import { setCurrentStep, setIsSaving, setIsSavingResuming, setIsFilingPaying, setResource,
  setKeycloakRoles, setAuthRoles, setCurrentDate, setCertifyStatementResource, setCertifyState, setBusinessContact,
  setDefineCompanyStepValidity, setNameRequestState, setFilingId, setOfficeAddresses, setRegisteredOffice,
  setRecordsOffice } from './actions'

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
    getBusinessIdentifier,
    getOfficeAddresses
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
    mutateFilingId,
    mutateOfficeAddresses,
    mutateRegisteredOffice,
    mutateRecordsOffice
  },
  actions: {
    setCurrentStep,
    setIsSaving,
    setIsSavingResuming,
    setIsFilingPaying,
    setResource,
    setKeycloakRoles,
    setAuthRoles,
    setCurrentDate,
    setCertifyStatementResource,
    setCertifyState,
    setBusinessContact,
    setDefineCompanyStepValidity,
    setNameRequestState,
    setFilingId,
    setOfficeAddresses,
    setRegisteredOffice,
    setRecordsOffice
  }
})
