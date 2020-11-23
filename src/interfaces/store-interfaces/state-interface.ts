import { AccountInformationIF, CertifyIF, DefineCompanyIF, NameRequestIF, TombStoneIF, PeopleAndRoleIF,
  ShareStructureIF, DateTimeIF, IncorporationAgreementIF, NameTranslationIF } from '@/interfaces'

// State model example
export interface StateModelIF {
  tombstone: TombStoneIF
  accountInformation: AccountInformationIF
  nameRequest: NameRequestIF
  nameTranslations: NameTranslationIF[]
  currentDate: string
  certifyState: CertifyIF
  currentStep: number
  tempId: string
  entityType: string
  isSaving: boolean
  filingId: string
  isSavingResuming: boolean
  isFilingPaying: boolean
  defineCompanyStep: DefineCompanyIF
  addPeopleAndRoleStep: PeopleAndRoleIF
  createShareStructureStep: ShareStructureIF
  incorporationAgreementStep: IncorporationAgreementIF
  incorporationDateTime: DateTimeIF
  ignoreChanges: boolean
  haveChanges: boolean
}
