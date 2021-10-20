import { CorpTypeCd } from '@/enums'
import {
  AccountInformationIF,
  BusinessIF,
  CertifyIF,
  CourtOrderStepIF,
  CreateMemorandumIF,
  CreateRulesIF,
  DefineCompanyIF,
  DissolutionStateIF,
  EffectiveDateTimeIF,
  FeesIF,
  IncorporationAgreementIF,
  NameRequestIF,
  NameTranslationIF,
  PeopleAndRoleIF,
  ResourceIF,
  ShareStructureIF,
  StaffPaymentStepIF,
  TombstoneIF
} from '@/interfaces'

// State model example
export interface StateModelIF {
  currentJsDate: Date
  tombstone: TombstoneIF
  accountInformation: AccountInformationIF
  business: BusinessIF
  dissolution: DissolutionStateIF
  nameRequest: NameRequestIF
  nameTranslations: NameTranslationIF[]
  currentDate: string
  effectiveDateTime: EffectiveDateTimeIF
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
  ignoreChanges: boolean
  haveChanges: boolean
  validateSteps: boolean
  showErrors: boolean
  feePrices: FeesIF

  // staffPaymentStep and courtOrder are common and for now it is only used in dissolution
  staffPaymentStep: StaffPaymentStepIF
  courtOrderStep: CourtOrderStepIF
}

export interface StateIF {
  stateModel: StateModelIF
  resourceModel: ResourceIF
}
