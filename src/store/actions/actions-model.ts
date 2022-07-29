import {
  AccountInformationIF, ActionIF, AddressIF, ContactPointIF, CertifyIF, DissolutionStatementIF,
  IncorporationAddressIF, IncorporationAgreementIF, NameRequestIF, NameTranslationIF, OrgPersonIF,
  ResourceIF, ShareClassIF, CreateRulesIF, CreateMemorandumIF, ValidationDetailIF, FeesIF,
  UploadAffidavitIF, CreateResolutionIF, OrgInformationIF, NaicsIF,
  CompletingPartyIF,
  PartyIF
} from '@/interfaces'
import { BusinessTypes, CoopTypes, CorpTypeCd } from '@/enums'

export const setBusinessId: ActionIF = ({ commit }, businessId): void => {
  commit('mutateBusinessId', businessId)
}

export const setBusinessAddress: ActionIF = ({ commit }, address): void => {
  commit('mutateBusinessAddress', address)
}

export const setLegalName: ActionIF = ({ commit }, legalName): void => {
  commit('mutateLegalName', legalName)
}

export const setFoundingDate: ActionIF = ({ commit }, foundingDate): void => {
  commit('mutateFoundingDate', foundingDate)
}

export const setFilingType: ActionIF = ({ commit }, filingType): void => {
  commit('mutateFilingType', filingType)
}

export const setDissolutionType: ActionIF = ({ commit }, dissolutionType): void => {
  commit('mutateDissolutionType', dissolutionType)
}

export const setEntityType = ({ commit }, entityType: CorpTypeCd): void => {
  commit('mutateEntityType', entityType)
}

export const setResources = ({ commit }, resources: ResourceIF): void => {
  commit('mutateResources', resources)
}

export const setTempId = ({ commit }, tempId: string): void => {
  commit('mutateTempId', tempId)
}

export const setCurrentStep: ActionIF = ({ commit }, currentStep: number): void => {
  commit('mutateCurrentStep', currentStep)
}

export const setIsSaving: ActionIF = ({ commit }, isSaving: boolean): void => {
  commit('mutateIsSaving', isSaving)
}

export const setIsSavingResuming: ActionIF = ({ commit }, isSavingResuming: boolean): void => {
  commit('mutateIsSavingResuming', isSavingResuming)
}

export const setIsFilingPaying: ActionIF = ({ commit }, isFilingPaying: boolean): void => {
  commit('mutateIsFilingPaying', isFilingPaying)
}

export const setAuthRoles: ActionIF = ({ commit }, authRoles: Array<string>): void => {
  commit('mutateAuthRoles', authRoles)
}

export const setUserEmail: ActionIF = ({ commit }, userEmail: string): void => {
  commit('mutateUserEmail', userEmail)
}

export const setUserPhone: ActionIF = ({ commit }, userPhone: string): void => {
  commit('mutateUserPhone', userPhone)
}

export const setUserFirstName: ActionIF = ({ commit }, userFirstName: string): void => {
  commit('mutateUserFirstName', userFirstName)
}

export const setUserLastName: ActionIF = ({ commit }, userLastName: string): void => {
  commit('mutateUserLastName', userLastName)
}

export const setUserKeycloakGuid: ActionIF = ({ commit }, userKeycloakGuid: string): void => {
  commit('mutateUserKeycloakGuid', userKeycloakGuid)
}

export const setUserAddress: ActionIF = ({ commit }, userAddress: AddressIF): void => {
  commit('mutateUserAddress', userAddress)
}

export const setCurrentDate: ActionIF = ({ commit }, currentDate: string): void => {
  commit('mutateCurrentDate', currentDate)
}

export const setCurrentJsDate: ActionIF = ({ commit }, date: Date): void => {
  commit('mutateCurrentJsDate', date)
}

export const setIsFutureEffective: ActionIF = ({ commit }, isFutureEffective: boolean): void => {
  commit('mutateIsFutureEffective', isFutureEffective)
}

export const setEffectiveDate: ActionIF = ({ commit }, effectiveDate: Date): void => {
  commit('mutateEffectiveDate', effectiveDate)
}

export const setEffectiveDateTimeValid: ActionIF = ({ commit }, effectiveDateTimeValid: boolean): void => {
  commit('mutateEffectiveDateTimeValid', effectiveDateTimeValid)
}

export const setCertifyState: ActionIF = ({ commit }, certifyState: CertifyIF): void => {
  commit('mutateCertifyState', certifyState)
}

export const setBusinessContact: ActionIF = ({ commit }, businessContact: ContactPointIF): void => {
  commit('mutateBusinessContact', businessContact)
}

export const setCooperativeType: ActionIF = ({ commit }, cooperativeType: CoopTypes): void => {
  commit('mutateCooperativeType', cooperativeType)
}

export const setDefineCompanyStepValidity: ActionIF = ({ commit }, valid: boolean): void => {
  commit('mutateDefineCompanyStepValidity', valid)
}

export const setOfficeAddresses: ActionIF = ({ commit }, address: IncorporationAddressIF): void => {
  commit('mutateOfficeAddresses', address)
}

export const setFolioNumber: ActionIF = ({ commit }, folioNumber: string): void => {
  commit('mutateFolioNumber', folioNumber)
}

export const setTransactionalFolioNumber: ActionIF = ({ commit }, folioNumber: string): void => {
  commit('mutateTransactionalFolioNumber', folioNumber)
}

export const setTransactionalFolioNumberValidity: ActionIF = ({ commit }, valid: boolean): void => {
  commit('mutateTransactionalFolioNumberValidity', valid)
}

export const setAccountInformation: ActionIF = ({ commit }, accountInfo: AccountInformationIF): void => {
  commit('mutateAccountInformation', accountInfo)
}

export const setOrgInformation: ActionIF = ({ commit }, orgInfo: OrgInformationIF): void => {
  commit('mutateOrgInformation', orgInfo)
}

export const setNameRequestState: ActionIF = ({ commit }, nameRequestState: NameRequestIF): void => {
  commit('mutateNameRequestState', nameRequestState)
}

export const setNameTranslationState: ActionIF = ({ commit }, nameTranslationState: NameTranslationIF): void => {
  commit('mutateNameTranslation', nameTranslationState)
}

export const setFilingId: ActionIF = ({ commit }, filingId: number): void => {
  commit('mutateFilingId', filingId)
}

export const setOrgPersonList = ({ commit }, orgPeople: OrgPersonIF[]) => {
  commit('mutateOrgPersonList', orgPeople)
}

export const setAddPeopleAndRoleStepValidity = ({ commit }, valid: boolean) => {
  commit('mutateAddPeopleAndRoleStepValidity', valid)
}

export const setRules = ({ commit }, rules: CreateRulesIF) => {
  commit('mutateRules', rules)
}

export const setRulesStepValidity: ActionIF = ({ commit }, validationDetail: ValidationDetailIF): void => {
  commit('mutateRulesStepValidity', validationDetail)
}

export const setMemorandum = ({ commit }, memorandum: CreateMemorandumIF) => {
  commit('mutateMemorandum', memorandum)
}

export const setMemorandumStepValidity: ActionIF = ({ commit }, validationDetail: ValidationDetailIF): void => {
  commit('mutateMemorandumStepValidity', validationDetail)
}

export const setAffidavit = ({ commit }, affidavit: UploadAffidavitIF) => {
  commit('mutateAffidavit', affidavit)
}

export const setAffidavitStepValidity: ActionIF = ({ commit }, validationDetail: ValidationDetailIF): void => {
  commit('mutateAffidavitStepValidity', validationDetail)
}

export const setResolution = ({ commit }, resolution: CreateResolutionIF) => {
  commit('mutateResolution', resolution)
}

export const setResolutionStepValidationDetail: ActionIF = ({ commit }, validationDetail: ValidationDetailIF): void => {
  commit('mutateResolutionStepValidationDetail', validationDetail)
}

export const setShareClasses = ({ commit }, shareClasses: ShareClassIF[]) => {
  commit('mutateShareClasses', shareClasses)
}

export const setCreateShareStructureStepValidity = ({ commit }, valid: boolean) => {
  commit('mutateCreateShareStructureStepValidity', valid)
}

export const setIncorporationAgreementStepData: ActionIF = ({ commit }, stepData: IncorporationAgreementIF): void => {
  commit('mutateIncorporationAgreementStepData', stepData)
}

export const setIgnoreChanges: ActionIF = ({ commit }, ignoreChanges: boolean): void => {
  commit('mutateIgnoreChanges', ignoreChanges)
}

export const setHaveChanges: ActionIF = ({ commit }, haveChanges: boolean): void => {
  commit('mutateHaveChanges', haveChanges)
}

export const setValidateSteps: ActionIF = ({ commit }, validate: boolean): void => {
  commit('mutateValidateSteps', validate)
}

export const setShowErrors: ActionIF = ({ commit }, showErrors: boolean): void => {
  commit('mutateShowErrors', showErrors)
}

export const setDissolutionStatementStepData: ActionIF = ({ commit }, stepData: DissolutionStatementIF): void => {
  commit('mutateDissolutionStatementStepData', stepData)
}

export const setFeePrices: ActionIF = ({ commit }, feePrices: Array<FeesIF>): void => {
  commit('mutateFeePrices', feePrices)
}

export const setStaffPayment: ActionIF = ({ commit }, staffPayment): void => {
  commit('mutateStaffPayment', staffPayment)
}

export const setStaffPaymentValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateStaffPaymentValidity', validity)
}

export const setCourtOrderFileNumber: ActionIF = ({ commit }, courtOrderNumber: string): void => {
  commit('mutateCourtOrderFileNumber', courtOrderNumber)
}

export const setHasPlanOfArrangement: ActionIF = ({ commit }, hasPoa: boolean): void => {
  commit('mutateHasPlanOfArrangement', hasPoa)
}

export const setCourtOrderValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateCourtOrderValidity', validity)
}

export const setDocumentOptionalEmail: ActionIF = ({ commit }, documentOptionalEmail: string): void => {
  commit('mutateDocumentOptionalEmail', documentOptionalEmail)
}

export const setDocumentOptionalEmailValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateDocumentOptionalEmailValidity', validity)
}

export const setHasCertificateDestroyed: ActionIF = ({ commit }, hasCertificateDestroyed: boolean): void => {
  commit('mutateHasCertificateDestroyed', hasCertificateDestroyed)
}

export const setCustodianValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateCustodianValidity', validity)
}

export const setCustodianOfRecords: ActionIF = ({ commit }, custodian: OrgPersonIF): void => {
  commit('mutateCustodianOfRecords', custodian)
}

//
// Registration actions
//

export const setRegistrationDefineBusinessValid: ActionIF = ({ commit }, val: boolean): void => {
  commit('mutateRegistrationDefineBusinessValid', val)
}

export const setRegistrationStartDate: ActionIF = ({ commit }, val: string): void => {
  commit('mutateRegistrationStartDate', val)
}

export const setRegistrationBusinessAddress: ActionIF = ({ commit }, val: IncorporationAddressIF): void => {
  commit('mutateRegistrationBusinessAddress', val)
}

export const setRegistrationFeeAcknowledgement: ActionIF = ({ commit }, val: boolean): void => {
  commit('mutateRegistrationFeeAcknowledgement', val)
}

export const setRegistrationNaics: ActionIF = ({ commit }, val: NaicsIF): void => {
  commit('mutateRegistrationNaics', val)
}

export const setRegistrationBusinessNumber: ActionIF = ({ commit }, val: string): void => {
  commit('mutateRegistrationBusinessNumber', val)
}

export const setIsAutoPopulatedBusinessNumber: ActionIF = ({ commit }, val: boolean): void => {
  commit('mutateIsAutoPopulatedBusinessNumber', val)
}

export const setRegistrationBusinessType: ActionIF = ({ commit }, businessType: BusinessTypes): void => {
  commit('mutateRegistrationBusinessType', businessType)
}

export const setRegistrationBusinessTypeConfirm: ActionIF = ({ commit }, businessTypeConfirm: boolean): void => {
  commit('mutateRegistrationBusinessTypeConfirm', businessTypeConfirm)
}

export const setCompletingParty: ActionIF = ({ commit }, cp: CompletingPartyIF): void => {
  commit('mutateCompletingParty', cp)
}

export const setCompletingPartyValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateCompletingPartyValidity', validity)
}

export const setDissolutionDate: ActionIF = ({ commit }, val: string): void => {
  commit('mutateDissolutionDate', val)
}

export const setParties: ActionIF = ({ commit }, val: Array<PartyIF>): void => {
  commit('mutateParties', val)
}
