import { CertifyStatementIF, CertifyIF } from '@/interfaces'

export const mutateName = (state: any, name: string) => {
  state.stateModel.stateText = name
}

export const mutateResource = (state: any, resource: object) => {
  state.resourceModel = resource
}

export const mutateKeycloakRoles = (state: any, keyCloakRoles: Array<string>) => {
  state.tombStoneModel.keycloakRoles = keyCloakRoles
}

export const mutateAuthRoles = (state: any, authRoles: Array<string>) => {
  state.tombStoneModel.authRoles = authRoles
}

export const mutateEntityType = (state: any, entityType: string) => {
  state.tombStoneModel.entityType = entityType
}

export const mutateCurrentDate = (state: any, currentDate: string) => {
  state.stateModel.currentDate = currentDate
}

export const mutateCertifyStatementResource = (state: any, certifyStatementResource: CertifyStatementIF) => {
  state.stateModel.certifyStatementResource = certifyStatementResource
}

export const mutateCertifyState = (state: any, certifyState: CertifyIF) => {
  state.certifyState = certifyState
}
