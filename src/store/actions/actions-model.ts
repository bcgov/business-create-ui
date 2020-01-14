import { ActionIF } from '@/interfaces/store-interfaces/action-interface'

export const setName: ActionIF = ({ commit }, name): void => {
  commit('mutateName', name)
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

export const setEntityType: ActionIF = ({ commit }, entityType): void => {
  commit('mutateEntityType', entityType)
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
