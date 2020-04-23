import { ActionIF } from '@/interfaces/store-interfaces/action-interface'

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

export const setCurrentDate: ActionIF = ({ commit }, currentDate): void => {
  commit('mutateCurrentDate', currentDate)
}

export const setIsImmediate: ActionIF = ({ commit }, isImmediate): void => {
  commit('mutateIsImmediate', isImmediate)
}

export const setIsFutureEffective: ActionIF = ({ commit }, isFutureEffective): void => {
  commit('mutateIsFutureEffective', isFutureEffective)
}

export const setFutureEffectiveDate: ActionIF = ({ commit }, futureEffectiveDate): void => {
  commit('mutateFutureEffectiveDate', futureEffectiveDate)
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

export const setNameRequestState: ActionIF = ({ commit }, nameRequestState): void => {
  commit('mutateNameRequestState', nameRequestState)
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

export const setIgnoreChanges: ActionIF = ({ commit }, ignoreChanges): void => {
  commit('mutateIgnoreChanges', ignoreChanges)
}

export const setHaveChanges: ActionIF = ({ commit }, haveChanges): void => {
  commit('mutateHaveChanges', haveChanges)
}
