import {
  CertifyStatementIF, CertifyIF, IncorporationAddressIf, NameRequestIF,
  BusinessContactIF, OrgPersonIF, ShareClassIF, AccountInformationIF
} from '@/interfaces'

export const mutateTemporaryId = (state: any, tempId: string) => {
  state.stateModel.tempId = tempId
}

export const mutateCertifyStatementResource = (state: any, certifyStatementResource: CertifyStatementIF) => {
  state.resourceModel.certifyStatementResource = certifyStatementResource
}

export const mutateKeycloakRoles = (state: any, keyCloakRoles: Array<string>) => {
  state.stateModel.tombstone.keycloakRoles = keyCloakRoles
}

export const mutateAuthRoles = (state: any, authRoles: Array<string>) => {
  state.stateModel.tombstone.authRoles = authRoles
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

export const mutateCurrentDate = (state: any, currentDate: string) => {
  state.stateModel.currentDate = currentDate
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateIsFutureEffective = (state: any, isFutureEffective: boolean) => {
  state.stateModel.incorporationDateTime.isFutureEffective = isFutureEffective
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateEffectiveDate = (state: any, effectiveDate: string) => {
  state.stateModel.incorporationDateTime.effectiveDate = effectiveDate
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateIsIncorporationDateTimeValid = (state: any, incorporationDateTimeValid: boolean) => {
  state.stateModel.incorporationDateTime.valid = incorporationDateTimeValid
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateCertifyState = (state: any, certifyState: CertifyIF) => {
  state.stateModel.certifyState = certifyState
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateBusinessContact = (state: any, businessContact: BusinessContactIF) => {
  state.stateModel.defineCompanyStep.businessContact = businessContact
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateDefineCompanyStepValidity = (state: any, validity: boolean) => {
  state.stateModel.defineCompanyStep.valid = validity
}

export const mutateOfficeAddresses = (state: any, addresses: IncorporationAddressIf) => {
  state.stateModel.defineCompanyStep.officeAddresses = addresses
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateOrgPersonList = (state: any, orgPeople: OrgPersonIF[]) => {
  state.stateModel.addPeopleAndRoleStep.orgPeople = orgPeople
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateAddPeopleAndRoleStepValidity = (state: any, validity: boolean) => {
  state.stateModel.addPeopleAndRoleStep.valid = validity
}

export const mutateFolioNumber = (state: any, folioNumber: string) => {
  state.stateModel.defineCompanyStep.folioNumber = folioNumber
}

export const mutateAccountInformation = (state: any, accountInfo: AccountInformationIF) => {
  state.stateModel.accountInformation = accountInfo
}

export const mutateNameRequestState = (state: any, nameRequestState: NameRequestIF) => {
  state.stateModel.nameRequest = nameRequestState
}

export const mutateFilingId = (state: any, filingId: number) => {
  state.stateModel.filingId = filingId
}

export const mutateShareClasses = (state: any, shareClasses: ShareClassIF[]) => {
  state.stateModel.createShareStructureStep.shareClasses = shareClasses
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateCreateShareStructureStepValidity = (state: any, validity: boolean) => {
  state.stateModel.createShareStructureStep.valid = validity
}

export const mutateIgnoreChanges = (state: any, ignoreChanges: boolean) => {
  state.stateModel.ignoreChanges = ignoreChanges
}

export const mutateHaveChanges = (state: any, haveChanges: boolean) => {
  state.stateModel.haveChanges = haveChanges
}

export const mutateEntityType = (state: any, entityType) => {
  state.stateModel.entityType = entityType
}
