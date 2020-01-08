export const mutateName = (state: any, name: string) => {
  state.stateModel.stateText = name
}

export const mutateResource = (state: any, resource: object) => {
  state.resourceModel = resource
}

export const mutateTombStone = (state: any, tombStone: Array<string>) => {
  state.tombStoneModel.keycloakRoles = tombStone
}
