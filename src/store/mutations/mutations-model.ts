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
