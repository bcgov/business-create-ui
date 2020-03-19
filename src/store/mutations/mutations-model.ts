import { CertifyStatementIF, CertifyIF, IncorporationAddressIf, NameRequestIF, BaseAddressObjIF,
  ExternalResourceIF, BusinessContactIF, OrgPersonIF } from '@/interfaces'

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

export const mutateResource = (state: any, resource: ExternalResourceIF) => {
  state.resourceModel.externalResource = resource
}

export const mutateKeycloakRoles = (state: any, keyCloakRoles: Array<string>) => {
  state.stateModel.tombstone.keycloakRoles = keyCloakRoles
}

export const mutateAuthRoles = (state: any, authRoles: Array<string>) => {
  state.stateModel.tombstone.authRoles = authRoles
}

export const mutateAuthenticated = (state: any, authenticated: boolean) => {
  state.stateModel.tombstone.authenticated = authenticated
}

export const mutateCurrentDate = (state: any, currentDate: string) => {
  state.stateModel.currentDate = currentDate
}

export const mutateCertifyStatementResource = (state: any, certifyStatementResource: CertifyStatementIF) => {
  state.resourceModel.certifyStatementResource = certifyStatementResource
}

export const mutateCertifyState = (state: any, certifyState: CertifyIF) => {
  state.stateModel.certifyState = certifyState
}

export const mutateBusinessContact = (state: any, businessContact: BusinessContactIF) => {
  state.stateModel.defineCompanyStep.businessContact = businessContact
}

export const mutateDefineCompanyStepValidity = (state: any, validity: boolean) => {
  state.stateModel.defineCompanyStep.valid = validity
}

export const mutateOfficeAddresses = (state: any, addresses: IncorporationAddressIf) => {
  state.stateModel.defineCompanyStep.officeAddresses = addresses
}

export const mutateOrgPersonList = (state: any, orgPeople: OrgPersonIF[]) => {
  state.stateModel.addPeopleAndRoleStep.orgPeople = orgPeople
}

export const mutateAddPeopleAndRoleStepValidity = (state: any, validity: boolean) => {
  state.stateModel.addPeopleAndRoleStep.valid = validity
}

export const mutateNameRequestState = (state: any, nameRequestState: NameRequestIF) => {
  state.stateModel.nameRequest = nameRequestState
}

export const mutateFilingId = (state: any, filingId: number) => {
  state.stateModel.nameRequest.filingId = filingId
}
