import { ActionIF } from '@/interfaces/action-interface'

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
