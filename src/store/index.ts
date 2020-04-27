// Libraries
import Vue from 'vue'
import Vuex from 'vuex'

// State
import { stateModel, resourceModel } from './state'

// Getters
import { isRoleStaff, isAuthEdit, isAuthView, isEntityType, isTypeBcomp, isTypeCoop,
  isShowBackBtn, isShowReviewConfirmBtn, isShowFilePayBtn, isEnableFilePayBtn, isBusySaving,
  getFilingId, getBusinessIdentifier, getApprovedName, getNameRequestDetails, getNameRequestApplicant,
  getOfficeAddresses, isApplicationValid, getSteps, getMaxStep, getCurrentDate, ignoreChanges,
  haveChanges }
  from '@/store/getters'

// Mutations
import { mutateCurrentStep, mutateIsSaving, mutateIsSavingResuming, mutateIsFilingPaying,
  mutateKeycloakRoles, mutateAuthRoles, mutateCurrentDate,
  mutateCertifyStatementResource, mutateCertifyState, mutateBusinessContact, mutateDefineCompanyStepValidity,
  mutateNameRequestState, mutateFilingId, mutateOfficeAddresses, mutateOrgPersonList,
  mutateAddPeopleAndRoleStepValidity, mutateShareClasses, mutateCreateShareStructureStepValidity,
  mutateIgnoreChanges, mutateHaveChanges, mutateIsFutureEffective, mutateEffectiveDate, mutateIsImmediate,
  mutateIsIncorporationDateTimeValid }
  from '@/store/mutations'

// Actions
import { setCurrentStep, setIsSaving, setIsSavingResuming, setIsFilingPaying,
  setKeycloakRoles, setAuthRoles, setCurrentDate, setCertifyStatementResource, setCertifyState,
  setBusinessContact, setDefineCompanyStepValidity, setNameRequestState, setFilingId, setOfficeAddresses,
  setOrgPersonList, setAddPeopleAndRoleStepValidity, setShareClasses,
  setCreateShareStructureStepValidity, setIgnoreChanges, setHaveChanges, setIsFutureEffective,
  setEffectiveDate, setIsImmediate, setIsIncorporationDateTimeValid } from './actions'

/**
 * Configures and returns Vuex Store.
 */
export function getVuexStore () {
  Vue.use(Vuex)

  const store = new Vuex.Store<any>({
    state: {
      stateModel,
      resourceModel
    },
    getters: {
      isRoleStaff,
      isAuthEdit,
      isAuthView,
      isEntityType,
      isTypeBcomp,
      isTypeCoop,
      isShowBackBtn,
      isShowReviewConfirmBtn,
      isShowFilePayBtn,
      isEnableFilePayBtn,
      isBusySaving,
      getApprovedName,
      getBusinessIdentifier,
      getFilingId,
      getNameRequestApplicant,
      getNameRequestDetails,
      getOfficeAddresses,
      isApplicationValid,
      getSteps,
      getMaxStep,
      getCurrentDate,
      ignoreChanges,
      haveChanges
    },
    mutations: {
      mutateCurrentStep,
      mutateIsSaving,
      mutateIsSavingResuming,
      mutateIsFilingPaying,
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
      mutateOrgPersonList,
      mutateAddPeopleAndRoleStepValidity,
      mutateShareClasses,
      mutateCreateShareStructureStepValidity,
      mutateIgnoreChanges,
      mutateHaveChanges,
      mutateIsImmediate,
      mutateIsFutureEffective,
      mutateEffectiveDate,
      mutateIsIncorporationDateTimeValid
    },
    actions: {
      setCurrentStep,
      setIsSaving,
      setIsSavingResuming,
      setIsFilingPaying,
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
      setOrgPersonList,
      setAddPeopleAndRoleStepValidity,
      setShareClasses,
      setCreateShareStructureStepValidity,
      setIgnoreChanges,
      setHaveChanges,
      setIsImmediate,
      setIsFutureEffective,
      setEffectiveDate,
      setIsIncorporationDateTimeValid
    }
  })

  return store
}
