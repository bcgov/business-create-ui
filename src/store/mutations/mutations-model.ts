export const mutateName = (state: any, name: string) => {
  state.stateModel.stateText = name
}

export const mutateCurrentStep = (state: any, currentStep: boolean) => {
  state.stateModel.currentStep = currentStep
}

export const mutateIsSaving = (state: any, isSaving: boolean) => {
  state.stateModel.isSaving = isSaving
}

export const mutateIsSavingResuming = (state: any, isSavingResuming: boolean) => {
  state.stateModel.isSavingResuming = isSavingResuming
}

export const mutateIsFilingPaying = (state: any, isFilingPaying: boolean) => {
  state.stateModel.isFilingPaying = isFilingPaying
}

export const mutateEntityType = (state: any, entityType: string) => {
  state.tombStoneModel.entityType = entityType
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
