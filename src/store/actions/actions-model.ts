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

export const setResource: ActionIF = ({ commit }, resource): void => {
  commit('mutateResource', resource)
}

export const setKeyCloakRoles: ActionIF = ({ commit }, keyCloakRoles): void => {
  commit('mutateKeycloakRoles', keyCloakRoles)
}

export const setAuthRoles: ActionIF = ({ commit }, authRoles): void => {
  commit('mutateAuthRoles', authRoles)
}

export const setCurrentDate: ActionIF = ({ commit }, currentDate): void => {
  commit('mutateCurrentDate', currentDate)
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

export const setNameRequestState: ActionIF = ({ commit }, nameRequestState): void => {
  commit('mutateNameRequestState', nameRequestState)
}

export const setFilingId: ActionIF = ({ commit }, filingId): void => {
  commit('mutateFilingId', filingId)
}
