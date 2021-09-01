import { CoopType, CorpTypeCd } from '@/enums'
import {
  AccountInformationIF,
  AddressIF,
  BusinessContactIF,
  CertifyIF,
  IncorporationAddressIF,
  IncorporationAgreementIF,
  NameRequestIF,
  NameTranslationIF,
  OrgPersonIF,
  ResourceIF,
  ShareClassIF,
  StateIF,
  RulesDocIF,
  CreateRulesIF
} from '@/interfaces'

export const mutateTempId = (state: StateIF, tempId: string) => {
  state.stateModel.tempId = tempId
}

export const mutateCompanyResources = (state: StateIF, companyResources: ResourceIF): void => {
  state.resourceModel = companyResources
}

export const mutateAuthRoles = (state: StateIF, authRoles: Array<string>) => {
  state.stateModel.tombstone.authRoles = authRoles
}

export const mutateCooperativeType = (state: StateIF, cooperativeType: CoopType) => {
  state.stateModel.defineCompanyStep.cooperativeType = cooperativeType
}

export const mutateUserEmail = (state: StateIF, userEmail: string) => {
  state.stateModel.tombstone.userEmail = userEmail
}

export const mutateUserFirstName = (state: StateIF, userFirstName: string) => {
  state.stateModel.tombstone.userFirstName = userFirstName
}

export const mutateUserPhone = (state: StateIF, userPhone: string) => {
  state.stateModel.tombstone.userPhone = userPhone
}

export const mutateUserLastName = (state: StateIF, userLastName: string) => {
  state.stateModel.tombstone.userLastName = userLastName
}

export const mutateUserKeycloakGuid = (state: StateIF, userKeycloakGuid: string) => {
  state.stateModel.tombstone.userKeycloakGuid = userKeycloakGuid
}

export const mutateUserAddress = (state: StateIF, userAddress: AddressIF) => {
  state.stateModel.tombstone.userAddress = userAddress
}

export const mutateCurrentStep = (state: StateIF, currentStep: number) => {
  state.stateModel.currentStep = currentStep
}

export const mutateIsSaving = (state: StateIF, isSaving: boolean) => {
  state.stateModel.isSaving = isSaving
}

export const mutateIsSavingResuming = (state: StateIF, isSavingResuming: boolean) => {
  state.stateModel.isSavingResuming = isSavingResuming
}

export const mutateIsFilingPaying = (state: StateIF, isFilingPaying: boolean) => {
  state.stateModel.isFilingPaying = isFilingPaying
}

export const mutateCurrentDate = (state: StateIF, currentDate: string) => {
  state.stateModel.currentDate = currentDate
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateIsFutureEffective = (state: StateIF, isFutureEffective: boolean) => {
  state.stateModel.incorporationDateTime.isFutureEffective = isFutureEffective
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateEffectiveDate = (state: StateIF, effectiveDate: Date) => {
  state.stateModel.incorporationDateTime.effectiveDate = effectiveDate
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateIsIncorporationDateTimeValid = (state: StateIF, incorporationDateTimeValid: boolean) => {
  state.stateModel.incorporationDateTime.valid = incorporationDateTimeValid
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateCertifyState = (state: StateIF, certifyState: CertifyIF) => {
  state.stateModel.certifyState = certifyState
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateBusinessContact = (state: StateIF, businessContact: BusinessContactIF) => {
  state.stateModel.defineCompanyStep.businessContact = businessContact
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateDefineCompanyStepValidity = (state: StateIF, valid: boolean) => {
  state.stateModel.defineCompanyStep.valid = valid
}

export const mutateOfficeAddresses = (state: StateIF, addresses: IncorporationAddressIF) => {
  state.stateModel.defineCompanyStep.officeAddresses = addresses
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateOrgPersonList = (state: StateIF, orgPeople: OrgPersonIF[]) => {
  state.stateModel.addPeopleAndRoleStep.orgPeople = orgPeople
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateAddPeopleAndRoleStepValidity = (state: StateIF, valid: boolean) => {
  state.stateModel.addPeopleAndRoleStep.valid = valid
}

export const mutateFolioNumber = (state: StateIF, folioNumber: string) => {
  state.stateModel.defineCompanyStep.folioNumber = folioNumber
}

export const mutateAccountInformation = (state: StateIF, accountInfo: AccountInformationIF) => {
  state.stateModel.accountInformation = accountInfo
}

export const mutateNameRequestState = (state: StateIF, nameRequestState: NameRequestIF) => {
  state.stateModel.nameRequest = nameRequestState
}

export const mutateNameTranslation = (state: StateIF, nameTranslationState: NameTranslationIF[]) => {
  state.stateModel.nameTranslations = nameTranslationState
}

export const mutateFilingId = (state: StateIF, filingId: number) => {
  state.stateModel.filingId = filingId
}

export const mutateRules = (state: StateIF, rules: CreateRulesIF) => {
  state.stateModel.createRulesStep = rules
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateMemorandum = (state: StateIF, memorandum: any) => {
  // state.stateModel.memorandum = memorandum // *** FUTURE: implement this
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateShareClasses = (state: StateIF, shareClasses: ShareClassIF[]) => {
  state.stateModel.createShareStructureStep.shareClasses = shareClasses
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateCreateShareStructureStepValidity = (state: StateIF, valid: boolean) => {
  state.stateModel.createShareStructureStep.valid = valid
}

export const mutateIncorporationAgreementStepData = (state: StateIF, stepData: IncorporationAgreementIF) => {
  state.stateModel.incorporationAgreementStep = stepData
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateIgnoreChanges = (state: StateIF, ignoreChanges: boolean) => {
  state.stateModel.ignoreChanges = ignoreChanges
}

export const mutateHaveChanges = (state: StateIF, haveChanges: boolean) => {
  state.stateModel.haveChanges = haveChanges
}

export const mutateEntityType = (state: StateIF, entityType: CorpTypeCd) => {
  state.stateModel.entityType = entityType
}

export const mutateValidateSteps = (state: StateIF, validate: boolean) => {
  state.stateModel.validateSteps = validate
}

export const mutateShowErrors = (state: StateIF, showErrors: boolean) => {
  state.stateModel.showErrors = showErrors
}
