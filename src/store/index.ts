// Libraries
import Vue from 'vue'
import Vuex from 'vuex'

// State
import { stateModel, resourceModel } from './state'

// Getters
import { isRoleStaff, isAuthEdit, isAuthView, isEntityType, isTypeBcomp, isTypeCoop,
  isShowBackBtn, isShowReviewConfirmBtn, isShowFilePayBtn, isEnableFilePayBtn, isBusySaving,
  getFilingId, getBusinessIdentifier, getApprovedName, getFolioNumber, getNameRequestDetails, getNameRequestApplicant,
  getOfficeAddresses, isApplicationValid, getSteps, getMaxStep, getCurrentDate, ignoreChanges,
  haveChanges }
  from '@/store/getters'

// Mutations
import { mutateCurrentStep, mutateIsSaving, mutateIsSavingResuming, mutateIsFilingPaying,
  mutateKeycloakRoles, mutateAuthRoles, mutateCurrentDate, mutateFolioNumber,
  mutateCertifyStatementResource, mutateCertifyState, mutateBusinessContact, mutateDefineCompanyStepValidity,
  mutateNameRequestState, mutateFilingId, mutateOfficeAddresses, mutateOrgPersonList,
  mutateAddPeopleAndRoleStepValidity, mutateShareClasses, mutateCreateShareStructureStepValidity,
  mutateIgnoreChanges, mutateHaveChanges, mutateIsFutureEffective, mutateEffectiveDate,
  mutateIsIncorporationDateTimeValid }
  from '@/store/mutations'

// Actions
import { setCurrentStep, setIsSaving, setIsSavingResuming, setIsFilingPaying,
  setKeycloakRoles, setAuthRoles, setCurrentDate, setCertifyStatementResource, setCertifyState,
  setBusinessContact, setDefineCompanyStepValidity, setNameRequestState, setFilingId, setFolioNumber,
  setOfficeAddresses, setOrgPersonList, setAddPeopleAndRoleStepValidity, setShareClasses,
  setCreateShareStructureStepValidity, setIgnoreChanges, setHaveChanges, setIsFutureEffective,
  setEffectiveDate, setIsIncorporationDateTimeValid } from './actions'

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
      getFolioNumber,
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
      mutateFolioNumber,
      mutateOfficeAddresses,
      mutateOrgPersonList,
      mutateAddPeopleAndRoleStepValidity,
      mutateShareClasses,
      mutateCreateShareStructureStepValidity,
      mutateIgnoreChanges,
      mutateHaveChanges,
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
      setFolioNumber,
      setOfficeAddresses,
      setOrgPersonList,
      setAddPeopleAndRoleStepValidity,
      setShareClasses,
      setCreateShareStructureStepValidity,
      setIgnoreChanges,
      setHaveChanges,
      setIsFutureEffective,
      setEffectiveDate,
      setIsIncorporationDateTimeValid
    }
  })

  return store
}
