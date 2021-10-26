import { CoopType, CorpTypeCd, DissolutionTypes, FilingTypes } from '@/enums'
import {
  AccountInformationIF,
  AddressIF,
  BaseAddressObjIF,
  BusinessContactIF,
  CertifyIF,
  IncorporationAddressIF,
  IncorporationAgreementIF,
  NameRequestIF,
  NameTranslationIF,
  OrgPersonIF,
  ShareClassIF,
  StateIF,
  CreateRulesIF,
  CreateMemorandumIF,
  ValidationDetailIF,
  DissolutionStatementIF,
  FeesIF,
  ResourceIF,
  UploadAffidavitIF
} from '@/interfaces'

export const mutateBusinessId = (state: StateIF, businessId: string) => {
  state.stateModel.business.businessId = businessId
}

export const mutateBusinessAddress = (state: StateIF, address: BaseAddressObjIF) => {
  state.stateModel.business.officeAddress = address
}

export const mutateLegalName = (state: StateIF, legalName: string) => {
  state.stateModel.business.legalName = legalName
}

export const mutateFilingType = (state: StateIF, filingType: FilingTypes) => {
  state.stateModel.tombstone.filingType = filingType
}

export const mutateDissolutionType = (state: StateIF, dissolutionType: DissolutionTypes) => {
  state.stateModel.dissolution.dissolutionType = dissolutionType
}

export const mutateTempId = (state: StateIF, tempId: string) => {
  state.stateModel.tempId = tempId
}

export const mutateResources = (state: StateIF, resources: ResourceIF): void => {
  state.resourceModel = resources
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

export const mutateCurrentJsDate = (state: StateIF, date: Date) => {
  state.stateModel.currentJsDate = date
}

export const mutateIsFutureEffective = (state: StateIF, isFutureEffective: boolean) => {
  state.stateModel.effectiveDateTime.isFutureEffective = isFutureEffective
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateEffectiveDate = (state: StateIF, effectiveDate: Date) => {
  state.stateModel.effectiveDateTime.effectiveDate = effectiveDate
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateEffectiveDateTimeValid = (state: StateIF, effectiveDateTimeValid: boolean) => {
  state.stateModel.effectiveDateTime.valid = effectiveDateTimeValid
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

export const mutateAccountFolioNumber = (state: StateIF, folioNumber: string) => {
  state.stateModel.tombstone.folioNumber = folioNumber
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

export const mutateRulesStepValidity = (state: StateIF, validationDetail: ValidationDetailIF) => {
  state.stateModel.createRulesStep.validationDetail = validationDetail
}

export const mutateMemorandum = (state: StateIF, memorandum: CreateMemorandumIF) => {
  state.stateModel.createMemorandumStep = memorandum
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateMemorandumStepValidity = (state: StateIF, validationDetail: ValidationDetailIF) => {
  state.stateModel.createMemorandumStep.validationDetail = validationDetail
}

export const mutateAffidavit = (state: StateIF, affidavit: UploadAffidavitIF) => {
  state.stateModel.uploadAffidavitStep = affidavit
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateAffidavitStepValidity = (state: StateIF, validationDetail: ValidationDetailIF) => {
  state.stateModel.uploadAffidavitStep.validationDetail = validationDetail
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

export const mutateDissolutionStatementStepData = (state: StateIF, stepData: DissolutionStatementIF) => {
  state.stateModel.dissolution.dissolutionStatementStep = stepData
}

export const mutateFeePrices = (state: StateIF, feePrices: FeesIF) => {
  state.stateModel.feePrices = feePrices
}
