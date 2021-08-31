import { ActionIF } from '@/interfaces/store-interfaces/action-interface'
import {
  AccountInformationIF, AddressIF, BusinessContactIF, CertifyIF, IncorporationAddressIF,
  IncorporationAgreementIF, NameRequestIF, NameTranslationIF, OrgPersonIF, ResourceIF,
  ShareClassIF, RulesDocIF, CreateRulesIF
} from '@/interfaces'
import { CoopType, CorpTypeCd } from '@/enums'

export const setEntityType = ({ commit }, entityType: CorpTypeCd): void => {
  commit('mutateEntityType', entityType)
}

export const setCompanyResources = ({ commit }, companyResources: ResourceIF): void => {
  commit('mutateCompanyResources', companyResources)
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

export const setIsFutureEffective: ActionIF = ({ commit }, isFutureEffective: boolean): void => {
  commit('mutateIsFutureEffective', isFutureEffective)
}

export const setEffectiveDate: ActionIF = ({ commit }, effectiveDate: Date): void => {
  commit('mutateEffectiveDate', effectiveDate)
}

export const setIsIncorporationDateTimeValid: ActionIF = ({ commit }, incorporationDateTimeValid: boolean): void => {
  commit('mutateIsIncorporationDateTimeValid', incorporationDateTimeValid)
}

export const setCertifyState: ActionIF = ({ commit }, certifyState: CertifyIF): void => {
  commit('mutateCertifyState', certifyState)
}

export const setBusinessContact: ActionIF = ({ commit }, businessContact: BusinessContactIF): void => {
  commit('mutateBusinessContact', businessContact)
}

export const setCooperativeType: ActionIF = ({ commit }, cooperativeType: CoopType): void => {
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

export const setAccountInformation: ActionIF = ({ commit }, accountInfo: AccountInformationIF): void => {
  commit('mutateAccountInformation', accountInfo)
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

export const setRulesConfirmed: ActionIF = ({ commit }, rulesConfirmed: boolean): void => {
  commit('mutateRulesConfirmed', rulesConfirmed)
}

export const setRulesDoc: ActionIF = ({ commit }, rulesDoc: RulesDocIF): void => {
  commit('mutateRulesDoc', rulesDoc)
}

export const setRulesDocKey: ActionIF = ({ commit }, rulesDocKey: string): void => {
  commit('mutateRulesDocKey', rulesDocKey)
}

export const setMemorandum = ({ commit }, memorandum: any) => {
  commit('mutateMemorandum', memorandum)
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
