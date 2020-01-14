import { ActionIF } from '@/interfaces/store-interfaces/action-interface'

export const setName: ActionIF = ({ commit }, name): void => {
  commit('mutateName', name)
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

export const setEntityType: ActionIF = ({ commit }, entityType): void => {
  commit('mutateEntityType', entityType)
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
