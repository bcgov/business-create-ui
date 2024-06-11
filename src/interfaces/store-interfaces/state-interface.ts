import { CorrectNameOptions } from '@bcrs-shared-components/enums/'
import { NameRequestIF } from '@bcrs-shared-components/interfaces/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import {
  AccountInformationIF,
  AmalgamationStateIF,
  ContactPointIF,
  BusinessIF,
  CertifyIF,
  ContinuationInStateIF,
  CompletingPartyIF,
  CourtOrderStepIF,
  CreateMemorandumIF,
  CreateResolutionIF,
  CreateRulesIF,
  DefineCompanyIF,
  DissolutionStateIF,
  DocumentDeliveryIF,
  EffectiveDateTimeIF,
  FeesIF,
  IncorporationAgreementIF,
  NameTranslationIF,
  OrgInformationIF,
  PartyIF,
  PeopleAndRoleIF,
  RegistrationStateIF,
  ResourceIF,
  RestorationStateIF,
  ShareStructureIF,
  StaffPaymentStepIF,
  TombstoneIF,
  UploadAffidavitIF
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
  nameRequestApprovedName: string
  alternateName: string
  correctNameOption: CorrectNameOptions
  nameTranslations: NameTranslationIF[]
  nameTranslationsValid: boolean
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
  parties?: Array<PartyIF>
  amalgamation: AmalgamationStateIF
  continuationIn: ContinuationInStateIF
  restoration: RestorationStateIF

  // staffPaymentStep and courtOrder are common and for now are only used in dissolution
  staffPaymentStep: StaffPaymentStepIF
  courtOrderStep: CourtOrderStepIF

  // to calculate if this is a mobile screen
  windowWidth: number

  // list of unsaved documents (keys)
  unsavedDocuments: Array<string>
}

export interface StateIF {
  stateModel: StateModelIF
  resourceModel: ResourceIF
}
