import { ActionIF } from '@/interfaces/store-interfaces/action-interface'
import {
  AccountInformationIF, BusinessContactIF, CertifyIF, IncorporationAddressIF,
  IncorporationAgreementIF, NameRequestIF, NameTranslationIF, OrgPersonIF, ResourceIF,
  ShareClassIF
} from '@/interfaces'
import { CorpTypeCd } from '@/enums'

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

export const setKeycloakRoles: ActionIF = ({ commit }, keycloakRoles: Array<string>): void => {
  commit('mutateKeycloakRoles', keycloakRoles)
}

export const setAuthRoles: ActionIF = ({ commit }, authRoles: Array<string>): void => {
  commit('mutateAuthRoles', authRoles)
}

export const setUserEmail: ActionIF = ({ commit }, userEmail: string): void => {
  commit('mutateUserEmail', userEmail)
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

export const setRules = ({ commit }, rules: any) => {
  commit('mutateRules', rules)
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
