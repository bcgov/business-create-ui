import { CertifyStatementIF, CertifyIF, IncorporationAddressIf, NameRequestIF } from '@/interfaces'
import { ExternalResourceIF } from '@/interfaces/resource-interfaces/ExternalResourceIF'
import { BusinessContactIF } from '@/interfaces/stepper-interfaces/DefineCompany/business-contact-interface'

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

export const mutateOfficeAddresses = (state: any, address: IncorporationAddressIf) => {
  state.stateModel.defineCompanyStep.officeAddresses = address
}

export const mutateNameRequestState = (state: any, nameRequestState: NameRequestIF) => {
  state.stateModel.nameRequest = nameRequestState
}

export const mutateFilingId = (state: any, filingId: number) => {
  state.stateModel.nameRequest.filingId = filingId
}
