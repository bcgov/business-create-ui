import { CorpTypeCd } from '@/enums'
import {
  AccountInformationIF,
  BusinessContactIF,
  BusinessIF,
  CertifyIF,
  CourtOrderStepIF,
  CreateMemorandumIF,
  CreateRulesIF,
  DefineCompanyIF,
  DissolutionStateIF,
  DocumentDeliveryIF,
  EffectiveDateTimeIF,
  FeesIF,
  IncorporationAgreementIF,
  NameRequestIF,
  NameTranslationIF,
  PeopleAndRoleIF,
  ResourceIF,
  ShareStructureIF,
  StaffPaymentStepIF,
  TombstoneIF,
  UploadAffidavitIF,
  CreateResolutionIF
} from '@/interfaces'

// State model example
export interface StateModelIF {
  currentJsDate: Date
  tombstone: TombstoneIF
  accountInformation: AccountInformationIF
  business: BusinessIF
  businessContact: BusinessContactIF
  dissolution: DissolutionStateIF
  nameRequest: NameRequestIF
  nameTranslations: NameTranslationIF[]
  currentDate: string
  effectiveDateTime: EffectiveDateTimeIF
  certifyState: CertifyIF
  documentDelivery: DocumentDeliveryIF
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
  uploadAffidavitStep: UploadAffidavitIF
  createResolutionStep: CreateResolutionIF
  ignoreChanges: boolean
  haveChanges: boolean
  validateSteps: boolean
  showErrors: boolean
  feePrices: Array<FeesIF>

  // staffPaymentStep and courtOrder are common and for now it is only used in dissolution
  staffPaymentStep: StaffPaymentStepIF
  courtOrderStep: CourtOrderStepIF
}

export interface StateIF {
  stateModel: StateModelIF
  resourceModel: ResourceIF
}
