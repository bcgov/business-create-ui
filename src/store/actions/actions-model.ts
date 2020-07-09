import { ActionIF } from '@/interfaces/store-interfaces/action-interface'

export const setEntityType = ({ commit }, entityType): void => {
  commit('mutateEntityType', entityType)
}

export const setTempId = ({ commit }, tempId): void => {
  commit('mutateTempId', tempId)
}

export const setCurrentStep: ActionIF = ({ commit }, currentStep): void => {
  commit('mutateCurrentStep', currentStep)
}

export const setIsSaving: ActionIF = ({ commit }, isSaving): void => {
  commit('mutateIsSaving', isSaving)
}

export const setIsSavingResuming: ActionIF = ({ commit }, isSavingResuming): void => {
  commit('mutateIsSavingResuming', isSavingResuming)
}

export const setIsFilingPaying: ActionIF = ({ commit }, isFilingPaying): void => {
  commit('mutateIsFilingPaying', isFilingPaying)
}

export const setKeycloakRoles: ActionIF = ({ commit }, keycloakRoles): void => {
  commit('mutateKeycloakRoles', keycloakRoles)
}

export const setAuthRoles: ActionIF = ({ commit }, authRoles): void => {
  commit('mutateAuthRoles', authRoles)
}

export const setUserEmail: ActionIF = ({ commit }, userEmail): void => {
  commit('mutateUserEmail', userEmail)
}

export const setCurrentDate: ActionIF = ({ commit }, currentDate): void => {
  commit('mutateCurrentDate', currentDate)
}

export const setIsFutureEffective: ActionIF = ({ commit }, isFutureEffective): void => {
  commit('mutateIsFutureEffective', isFutureEffective)
}

export const setEffectiveDate: ActionIF = ({ commit }, effectiveDate): void => {
  commit('mutateEffectiveDate', effectiveDate)
}

export const setIsIncorporationDateTimeValid: ActionIF = ({ commit }, incorporationDateTimeValid): void => {
  commit('mutateIsIncorporationDateTimeValid', incorporationDateTimeValid)
}

export const setCertifyStatementResource: ActionIF = ({ commit }, certifyStatementResource): void => {
  commit('mutateCertifyStatementResource', certifyStatementResource)
}

export const setCertifyState: ActionIF = ({ commit }, certifyState): void => {
  commit('mutateCertifyState', certifyState)
}

export const setBusinessContact: ActionIF = ({ commit }, businessContact): void => {
  commit('mutateBusinessContact', businessContact)
}

export const setDefineCompanyStepValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateDefineCompanyStepValidity', validity)
}

export const setOfficeAddresses: ActionIF = ({ commit }, address): void => {
  commit('mutateOfficeAddresses', address)
}

export const setFolioNumber: ActionIF = ({ commit }, folioNumber): void => {
  commit('mutateFolioNumber', folioNumber)
}

export const setAccountInformation: ActionIF = ({ commit }, accountInfo): void => {
  commit('mutateAccountInformation', accountInfo)
}

export const setNameRequestState: ActionIF = ({ commit }, nameRequestState): void => {
  commit('mutateNameRequestState', nameRequestState)
}

export const setNameTranslationState: ActionIF = ({ commit }, nameTranslationState): void => {
  commit('mutateNameTranslation', nameTranslationState)
}

export const setFilingId: ActionIF = ({ commit }, filingId): void => {
  commit('mutateFilingId', filingId)
}

export const setOrgPersonList = ({ commit }, orgPeople) => {
  commit('mutateOrgPersonList', orgPeople)
}

export const setAddPeopleAndRoleStepValidity = ({ commit }, validity) => {
  commit('mutateAddPeopleAndRoleStepValidity', validity)
}

export const setShareClasses = ({ commit }, shareClasses) => {
  commit('mutateShareClasses', shareClasses)
}

export const setCreateShareStructureStepValidity = ({ commit }, validity) => {
  commit('mutateCreateShareStructureStepValidity', validity)
}

export const setIncorporationAgreementStepData: ActionIF = ({ commit }, stepData): void => {
  commit('mutateIncorporationAgreementStepData', stepData)
}

export const setIgnoreChanges: ActionIF = ({ commit }, ignoreChanges): void => {
  commit('mutateIgnoreChanges', ignoreChanges)
}

export const setHaveChanges: ActionIF = ({ commit }, haveChanges): void => {
  commit('mutateHaveChanges', haveChanges)
}
