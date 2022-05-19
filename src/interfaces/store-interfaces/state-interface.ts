import { CorpTypeCd } from '@/enums'
import {
  AccountInformationIF,
  ContactPointIF,
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
  RegistrationStateIF,
  ResourceIF,
  ShareStructureIF,
  StaffPaymentStepIF,
  TombstoneIF,
  UploadAffidavitIF,
  CreateResolutionIF,
  OrgInformationIF,
  CompletingPartyIF,
  PartyIF
} from '@/interfaces'

// State model interface
export interface StateModelIF {
  currentJsDate: Date
  tombstone: TombstoneIF
  accountInformation: AccountInformationIF
  orgInformation: OrgInformationIF
  business: BusinessIF
  businessContact: ContactPointIF
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
  registration: RegistrationStateIF
  completingParty?: CompletingPartyIF
  parties?:Array<PartyIF>

  // staffPaymentStep and courtOrder are common and for now are only used in dissolution
  staffPaymentStep: StaffPaymentStepIF
  courtOrderStep: CourtOrderStepIF

}

export interface StateIF {
  stateModel: StateModelIF
  resourceModel: ResourceIF
}
