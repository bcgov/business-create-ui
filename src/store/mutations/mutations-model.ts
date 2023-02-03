import { BusinessTypes, CoopTypes, CorpTypeCd, DissolutionTypes, EntityState, FilingTypes,
  RestorationTypes } from '@/enums'
import { AccountInformationIF, AddressIF, BusinessAddressIF, BusinessWarningIF, CertifyIF,
  CompletingPartyIF, ContactPointIF, CreateMemorandumIF, CreateResolutionIF, CreateRulesIF,
  DissolutionStatementIF, FeesIF, RegisteredRecordsAddressesIF, IncorporationAgreementIF, NaicsIF,
  NameRequestIF, NameTranslationIF, OfficeAddressIF, OrgInformationIF, OrgPersonIF, PartyIF,
  ResourceIF, ShareClassIF, StaffPaymentIF, StateIF, UploadAffidavitIF, ValidationDetailIF }
  from '@/interfaces'

export const mutateBusinessId = (state: StateIF, businessId: string) => {
  state.stateModel.business.businessId = businessId
}

export const mutateBusinessAddress = (state: StateIF, address: OfficeAddressIF) => {
  state.stateModel.business.officeAddress = address
}

export const mutateLegalName = (state: StateIF, legalName: string) => {
  state.stateModel.business.legalName = legalName
}

export const mutateFoundingDate = (state: StateIF, foundingDate: string) => {
  state.stateModel.business.foundingDate = foundingDate
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

export const mutateCooperativeType = (state: StateIF, cooperativeType: CoopTypes) => {
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
}

export const mutateCertifyState = (state: StateIF, certifyState: CertifyIF) => {
  state.stateModel.certifyState = certifyState
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateBusinessContact = (state: StateIF, businessContact: ContactPointIF) => {
  state.stateModel.businessContact = businessContact
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateDefineCompanyStepValidity = (state: StateIF, valid: boolean) => {
  state.stateModel.defineCompanyStep.valid = valid
}

export const mutateOfficeAddresses = (state: StateIF, addresses: RegisteredRecordsAddressesIF) => {
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
  state.stateModel.tombstone.folioNumber = folioNumber
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateTransactionalFolioNumber = (state: StateIF, folioNumber: string) => {
  state.stateModel.tombstone.transactionalFolioNumber = folioNumber
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateTransactionalFolioNumberValidity = (state: StateIF, valid: boolean) => {
  state.stateModel.tombstone.transactionalFolioNumberValid = valid
}

export const mutateAccountInformation = (state: StateIF, accountInfo: AccountInformationIF) => {
  state.stateModel.accountInformation = accountInfo
}

export const mutateOrgInformation = (state: StateIF, orgInfo: OrgInformationIF) => {
  state.stateModel.orgInformation = orgInfo
}

export const mutateNameRequest = (state: StateIF, nameRequest: NameRequestIF) => {
  state.stateModel.nameRequest = nameRequest
}

export const mutateNameRequestApprovedName = (state: StateIF, name: string) => {
  state.stateModel.nameRequestApprovedName = name
}

export const mutateNameTranslation = (state: StateIF, nameTranslationState: NameTranslationIF[]) => {
  state.stateModel.nameTranslations = nameTranslationState
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
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

export const mutateResolution = (state: StateIF, resolution: CreateResolutionIF) => {
  state.stateModel.createResolutionStep = resolution
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateResolutionStepValidationDetail = (state: StateIF, validationDetail: ValidationDetailIF) => {
  state.stateModel.createResolutionStep.validationDetail = validationDetail
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

export const mutateFeePrices = (state: StateIF, feePrices: Array<FeesIF>) => {
  state.stateModel.feePrices = feePrices
}

export const mutateStaffPayment = (state: StateIF, staffPayment: StaffPaymentIF) => {
  state.stateModel.staffPaymentStep.staffPayment = staffPayment
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateStaffPaymentValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.staffPaymentStep.valid = validity
}

export const mutateCourtOrderFileNumber = (state: StateIF, fileNumber: string) => {
  state.stateModel.courtOrderStep.courtOrder.fileNumber = fileNumber
}

export const mutateHasPlanOfArrangement = (state: StateIF, hasPoa: boolean) => {
  state.stateModel.courtOrderStep.courtOrder.hasPlanOfArrangement = hasPoa
}

export const mutateCourtOrderValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.courtOrderStep.valid = validity
}

export const mutateDocumentOptionalEmail = (state: StateIF, documentOptionalEmail: string) => {
  state.stateModel.documentDelivery.documentOptionalEmail = documentOptionalEmail
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateDocumentOptionalEmailValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.documentDelivery.valid = validity
}

export const mutateHasCertificateDestroyed = (state: StateIF, hasCertificateDestroyed: boolean) => {
  state.stateModel.dissolution.hasCertificateDestroyed = hasCertificateDestroyed
}

export const mutateCustodianValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.dissolution.custodianOfRecords.valid = validity
}

export const mutateCustodianOfRecords = (state: StateIF, custodian: OrgPersonIF) => {
  state.stateModel.dissolution.custodianOfRecords.custodian = custodian
}

//
// Registration mutations
//

export const mutateRegistrationDefineBusinessValid = (state: StateIF, val: boolean) => {
  state.stateModel.registration.defineBusinessValid = val
}

export const mutateRegistrationStartDate = (state: StateIF, val: string) => {
  state.stateModel.registration.startDate = val
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateRegistrationBusinessAddress = (state: StateIF, val: BusinessAddressIF) => {
  state.stateModel.registration.businessAddress = val
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateRegistrationFeeAcknowledgement = (state: StateIF, val: boolean) => {
  state.stateModel.registration.feeAcknowledgement = val
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateRegistrationNaics = (state: StateIF, val: NaicsIF) => {
  state.stateModel.registration.naics = val
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateRegistrationBusinessNumber = (state: StateIF, val: string) => {
  state.stateModel.registration.businessNumber = val
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateIsAutoPopulatedBusinessNumber = (state: StateIF, val: boolean) => {
  state.stateModel.registration.isAutoPopulatedBusinessNumber = val
}

export const mutateRegistrationBusinessType = (state: StateIF, businessType: BusinessTypes) => {
  state.stateModel.registration.businessType = businessType
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateRegistrationBusinessTypeConfirm = (state: StateIF, businessTypeConfirm: boolean) => {
  state.stateModel.registration.businessTypeConfirm = businessTypeConfirm
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateCompletingParty = (state: StateIF, cp: CompletingPartyIF) => {
  state.stateModel.completingParty = cp
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateCompletingPartyValidity = (state: StateIF, valid: boolean) => {
  state.stateModel.completingParty.valid = valid
}

export const mutateDissolutionDate = (state: StateIF, val: string) => {
  state.stateModel.dissolution.dissolutionDate = val
  if (!state.stateModel.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateParties = (state: StateIF, parties: Array<PartyIF>) => {
  state.stateModel.parties = parties
}

export const mutateAdminFreeze = (state: StateIF, adminFreeze: boolean) => {
  state.stateModel.business.adminFreeze = adminFreeze
}

export const mutateEntityName = (state: StateIF, legalName: string) => {
  state.stateModel.business.legalName = legalName
}

export const mutateEntityState = (state: StateIF, entityState: EntityState) => {
  state.stateModel.business.state = entityState
}

export const mutateBusinessNumber = (state: StateIF, taxId: string) => {
  state.stateModel.business.taxId = taxId
}

export const mutateIdentifier = (state: StateIF, identifier: string) => {
  state.stateModel.business.identifier = identifier
}

export const mutateLastAnnualReportDate = (state: StateIF, date: string) => {
  state.stateModel.business.lastAnnualReportDate = date
}

export const mutateLastAddressChangeDate = (state: StateIF, date: string) => {
  state.stateModel.business.lastAddressChangeDate = date
}

export const mutateLastDirectorChangeDate = (state: StateIF, date: string) => {
  state.stateModel.business.lastDirectorChangeDate = date
}

export const mutateBusinessWarnings = (state: StateIF, businessWarnings: Array<BusinessWarningIF>) => {
  state.stateModel.business.warnings = businessWarnings
}

export const mutateGoodStanding = (state: StateIF, goodStanding: boolean) => {
  state.stateModel.business.goodStanding = goodStanding
}

export const mutateWindowWidth = (state: StateIF, width: number) => {
  state.stateModel.windowWidth = width
}

export const mutateRestorationType = (state: StateIF, type: RestorationTypes) => {
  state.stateModel.restoration.type = type
}

export const mutateRestorationExpiry = (state: StateIF, expiry: string) => {
  state.stateModel.restoration.expiry = expiry
}
