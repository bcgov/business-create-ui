// Libraries
import Vue from 'vue'
import Vuex from 'vuex'

// State
import { stateModel, resourceModel } from './state'

// Getters
import { isRoleStaff, isAuthEdit, isAuthView, isEntityType, isTypeBcomp, isPremiumAccount, isTypeCoop,
  getAccountId, isShowBackBtn, isShowReviewConfirmBtn, isShowFilePayBtn, isEnableFilePayBtn, isBusySaving,
  getFilingId, getBusinessIdentifier, getApprovedName, getFolioNumber, getNameRequestDetails, getNameRequestApplicant,
  getOfficeAddresses, isApplicationValid, getSteps, getMaxStep, getCurrentDate, ignoreChanges,
  haveChanges, getNameRequestNumber }
  from '@/store/getters'

// Mutations
import { mutateCurrentStep, mutateIsSaving, mutateIsSavingResuming, mutateIsFilingPaying,
  mutateKeycloakRoles, mutateAuthRoles, mutateCurrentDate, mutateFolioNumber,
  mutateCertifyStatementResource, mutateCertifyState, mutateBusinessContact, mutateDefineCompanyStepValidity,
  mutateAccountInformation, mutateNameRequestState, mutateFilingId, mutateOfficeAddresses, mutateOrgPersonList,
  mutateAddPeopleAndRoleStepValidity, mutateShareClasses, mutateCreateShareStructureStepValidity,
  mutateIgnoreChanges, mutateHaveChanges, mutateIsFutureEffective, mutateEffectiveDate,
  mutateIsIncorporationDateTimeValid, mutateTemporaryId, mutateEntityType }
  from '@/store/mutations'

// Actions
import { setCurrentStep, setIsSaving, setIsSavingResuming, setIsFilingPaying,
  setKeycloakRoles, setAuthRoles, setCurrentDate, setCertifyStatementResource, setCertifyState,
  setBusinessContact, setDefineCompanyStepValidity, setNameRequestState, setFilingId, setFolioNumber,
  setOfficeAddresses, setOrgPersonList, setAddPeopleAndRoleStepValidity, setShareClasses,
  setCreateShareStructureStepValidity, setIgnoreChanges, setHaveChanges, setIsFutureEffective,
  setEffectiveDate, setIsIncorporationDateTimeValid, setAccountInformation, setTemporaryId, setEntityType } from './actions'

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
      isPremiumAccount,
      getAccountId,
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
      haveChanges,
      getNameRequestNumber
    },
    mutations: {
      mutateAccountInformation,
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
      mutateIsIncorporationDateTimeValid,
      mutateTemporaryId,
      mutateEntityType
    },
    actions: {
      setAccountInformation,
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
      setIsIncorporationDateTimeValid,
      setTemporaryId,
      setEntityType
    }
  })

  return store
}
