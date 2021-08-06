import { CorpTypeCd } from '@/enums'
import {
  AccountInformationIF,
  CertifyIF,
  CreateMemorandumIF,
  CreateRulesIF,
  DateTimeIF,
  DefineCompanyIF,
  IncorporationAgreementIF,
  NameRequestIF,
  NameTranslationIF,
  PeopleAndRoleIF,
  ResourceIF,
  ShareStructureIF,
  TombstoneIF
} from '@/interfaces'

// State model example
export interface StateModelIF {
  tombstone: TombstoneIF
  accountInformation: AccountInformationIF
  nameRequest: NameRequestIF
  nameTranslations: NameTranslationIF[]
  currentDate: string
  certifyState: CertifyIF
  currentStep: number
  tempId: string
  entityType: CorpTypeCd
  isSaving: boolean
  filingId: number
  isSavingResuming: boolean
  isFilingPaying: boolean
  defineCompanyStep: DefineCompanyIF
  addPeopleAndRoleStep: PeopleAndRoleIF
  createShareStructureStep: ShareStructureIF
  createRulesStep: CreateRulesIF
  incorporationAgreementStep: IncorporationAgreementIF
  createMemorandumStep: CreateMemorandumIF
  incorporationDateTime: DateTimeIF
  ignoreChanges: boolean
  haveChanges: boolean
  validateSteps: boolean
}

export interface StateIF {
  stateModel: StateModelIF
  resourceModel: ResourceIF
}
