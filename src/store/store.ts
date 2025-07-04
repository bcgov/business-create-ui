// Pinia store
import { defineStore } from 'pinia'
import Vuetify from 'vuetify'
import { resourceModel, stateModel } from './state'
import {
  AmalgamationTypes,
  ApprovalTypes,
  AuthorizedActions,
  BusinessTypes,
  CoopTypes,
  DissolutionTypes,
  EntityStates,
  FilingNames,
  FilingStatus,
  FilingTypes,
  RelationshipTypes,
  RestorationTypes
} from '@/enums'
import { CorrectNameOptions } from '@bcrs-shared-components/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import {
  AccountInformationIF,
  AddressIF,
  AffidavitResourceIF,
  AmalgamatingBusinessIF,
  BusinessAddressIF,
  BusinessWarningIF,
  CertifyIF,
  CompletingPartyIF,
  ContactPointIF,
  CourtOrderIF,
  CourtOrderStepIF,
  CreateMemorandumIF,
  CreateMemorandumResourceIF,
  CreateResolutionResourceIF,
  CreateResolutionIF,
  CreateRulesIF,
  CreateRulesResourceIF,
  CompletingPartyStatementIF,
  AuthorizationProofIF,
  ContinuationInStateIF,
  CustodianResourceIF,
  DefineCompanyIF,
  DissolutionStatementIF,
  DissolutionStateIF,
  DocumentDeliveryIF,
  EffectiveDateTimeIF,
  ExistingBusinessInfoIF,
  FeesIF,
  FilingDataIF,
  IncorporationAgreementIF,
  IncorporationAgreementTypeIF,
  KeyValueIF,
  NaicsIF,
  NameRequestIF,
  NameTranslationIF,
  NrApplicantIF,
  OfficeAddressIF,
  OrgInformationIF,
  OrgPersonIF,
  PartyIF,
  PeopleAndRoleIF,
  PeopleAndRolesResourceIF,
  RegisteredRecordsAddressesIF,
  RegistrationStateIF,
  ResourceIF,
  RestorationStateIF,
  ShareClassIF,
  ShareStructureIF,
  StaffPaymentIF,
  StaffPaymentStepIF,
  StateIF,
  StepIF,
  UploadAffidavitIF,
  ValidationDetailIF,
  ResolutionIF
} from '@/interfaces'
import { GetFeatureFlag } from '@/utils/feature-flag-utils'
import { IsAuthorized } from '@/utils'

// It's possible to move getters / actions into seperate files:
// https://github.com/vuejs/pinia/issues/802#issuecomment-1018780409
// Not sure if that's a good idea though.

export const useStore = defineStore('store', {
  state: (): StateIF => ({ resourceModel, stateModel }),
  getters: {
    /** True if current screen width is mobile. */
    isMobile (): boolean {
      // fall back to base window width if no window size changes have occurred
      const width = this.stateModel.windowWidth || window.innerWidth
      return (width < new Vuetify().framework.breakpoint.thresholds.sm)
    },

    /** Whether the current filing is an Amalgamation Application. */
    isAmalgamationFiling (): boolean {
      return (this.getFilingType === FilingTypes.AMALGAMATION_APPLICATION)
    },

    /** Whether the current filing is a Horizontal Short-form Amalgamation. */
    isAmalgamationFilingHorizontal (): boolean {
      return (
        this.isAmalgamationFiling &&
        this.getAmalgamationType === AmalgamationTypes.HORIZONTAL
      )
    },

    /** Whether the current filing is a Regular Amalgamation. */
    isAmalgamationFilingRegular (): boolean {
      return (
        this.isAmalgamationFiling &&
        this.getAmalgamationType === AmalgamationTypes.REGULAR
      )
    },

    /** Whether the current filing is a Vertical Short-form Amalgamation. */
    isAmalgamationFilingVertical (): boolean {
      return (
        this.isAmalgamationFiling &&
        this.getAmalgamationType === AmalgamationTypes.VERTICAL
      )
    },

    /** Whether the current filing is a Continuation In. */
    isContinuationInFiling (): boolean {
      return (this.getFilingType === FilingTypes.CONTINUATION_IN)
    },

    /**
     * Whether the current filing is in "authorization mode".
     * Use for Continuation In filings only atm.
     */
    isAuthorizationStatus (): boolean {
      // Draft: user is filling out the Continuation Authorization step only
      // Change Requested: user is making changes to the Continuation Authorization step only
      return [FilingStatus.DRAFT, FilingStatus.CHANGE_REQUESTED].includes(this.getFilingStatus)
    },

    /**
     * Whether this filing is a Continuation In Authorization (step 0).
     * Otherwise, it's a normal Continuation In filing (steps 1-4).
     */
    isContinuationInAuthorization (): boolean {
      return (
        this.isContinuationInFiling &&
        this.isAuthorizationStatus
      )
    },

    /** Whether the current filing is an Incorporation Application. */
    isIncorporationFiling (): boolean {
      return (this.getFilingType === FilingTypes.INCORPORATION_APPLICATION)
    },

    /** Whether the current filing is a Dissolution. */
    isDissolutionFiling (): boolean {
      return (this.getFilingType === FilingTypes.DISSOLUTION)
    },

    /** Whether the current filing is a Firm Dissolution. */
    isFirmDissolutionFiling (): boolean {
      return (this.isDissolutionFiling && this.isEntityFirm)
    },

    /** Whether the current filing is a Non-Firm Dissolution. */
    isOtherDissolutionFiling (): boolean {
      return (this.isDissolutionFiling && !this.isEntityFirm)
    },

    /** Whether the current filing is a Registration. */
    isRegistrationFiling (): boolean {
      return (this.getFilingType === FilingTypes.REGISTRATION)
    },

    /** Whether the current filing is a Restoration. */
    isRestorationFiling (): boolean {
      return (this.getFilingType === FilingTypes.RESTORATION)
    },

    /** Whether the current filing is a Limited Restoration. */
    isLimitedRestorationFiling (): boolean {
      return (this.getRestoration.type === RestorationTypes.LIMITED)
    },

    /** Whether the current filing is a Full Restoration. */
    isFullRestorationFiling (): boolean {
      return (this.getRestoration.type === RestorationTypes.FULL)
    },

    /** The current filing type. */
    getFilingType (): FilingTypes {
      return this.stateModel.tombstone.filingType
    },

    /** The current filing name. */
    getFilingName (): FilingNames {
      switch (this.getFilingType) {
        case FilingTypes.AMALGAMATION_APPLICATION: return FilingNames.AMALGAMATION_APPLICATION
        case FilingTypes.CONTINUATION_IN: return FilingNames.CONTINUATION_IN_APPLICATION
        case FilingTypes.INCORPORATION_APPLICATION: return FilingNames.INCORPORATION_APPLICATION
        case FilingTypes.REGISTRATION: return FilingNames.REGISTRATION
        case FilingTypes.RESTORATION: return FilingNames.RESTORATION_APPLICATION
        case FilingTypes.DISSOLUTION:
          return this.isEntityFirm ? FilingNames.DISSOLUTION_FIRM : FilingNames.VOLUNTARY_DISSOLUTION
        default: return null // should never happen
      }
    },

    getFilingStatus (): FilingStatus {
      return this.stateModel.tombstone.filingStatus
    },

    /** Whether the entity type has been identified. */
    isEntityType (): boolean {
      return !!this.getEntityType
    },

    /** The current entityType. */
    getEntityType (): CorpTypeCd {
      return this.stateModel.entityType
    },

    /** The continuation in Authorization Proof object. */
    getContinuationInAuthorizationProof (): AuthorizationProofIF {
      return this.getContinuationIn.authorizationProof
    },

    /** The continuation in Existing Business Info object. */
    getExistingBusinessInfo (): ExistingBusinessInfoIF {
      return this.getContinuationIn.existingBusinessInfo
    },

    /** The account folio number. */
    getFolioNumber (): string {
      return this.stateModel.tombstone.folioNumber
    },

    /** Is true when the folio number is valid. */
    getFolioNumberValid (): boolean {
      return this.stateModel.tombstone.folioNumberValid
    },

    /** The transactional folio number. */
    getTransactionalFolioNumber (): string {
      return this.stateModel.tombstone.transactionalFolioNumber
    },

    /** Is true when the transactional folio number is valid. */
    getTransactionalFolioNumberValid (): boolean {
      return this.stateModel.tombstone.transactionalFolioNumberValid
    },

    /** The staff payment folio number. */
    getStaffPaymentFolioNumber (): string {
      return this.getStaffPaymentStep.staffPayment.folioNumber
    },

    /** Whether the entity is a Benefit Company. */
    isEntityBenefitCompany (): boolean {
      return (this.getEntityType === CorpTypeCd.BENEFIT_COMPANY)
    },

    /** Whether the entity is a Cooperative Assocation. */
    isEntityCoop (): boolean {
      return (this.getEntityType === CorpTypeCd.COOP)
    },

    /** Whether the entity is a BC Community Contribution Company. */
    isEntityBcCcc (): boolean {
      return (this.getEntityType === CorpTypeCd.BC_CCC)
    },

    /** Whether the entity is a BC Limited Company. */
    isEntityBcCompany (): boolean {
      return (this.getEntityType === CorpTypeCd.BC_COMPANY)
    },

    /** Whether the entity is a BC Unlimited Liability Company. */
    isEntityBcUlcCompany (): boolean {
      return (this.getEntityType === CorpTypeCd.BC_ULC_COMPANY)
    },

    /** Whether the entity is a Sole Proprietorship. */
    isEntitySoleProp (): boolean {
      return (this.getEntityType === CorpTypeCd.SOLE_PROP)
    },

    /** Whether the entity is a General Partnership. */
    isEntityPartnership (): boolean {
      return (this.getEntityType === CorpTypeCd.PARTNERSHIP)
    },

    /** Whether the entity is a Continued In BC Limited Company. */
    isEntityContinueIn (): boolean {
      return (this.getEntityType === CorpTypeCd.CONTINUE_IN)
    },

    /** Whether the entity is a Continued In Benefit Company. */
    isEntityBenContinueIn (): boolean {
      return (this.getEntityType === CorpTypeCd.BEN_CONTINUE_IN)
    },

    /** Whether the entity is a Continued In Community Contribution Company. */
    isEntityCccContinueIn (): boolean {
      return (this.getEntityType === CorpTypeCd.CCC_CONTINUE_IN)
    },

    /** Whether the entity is a Continued In Unlimited Liability Company. */
    isEntityUlcContinueIn (): boolean {
      return (this.getEntityType === CorpTypeCd.ULC_CONTINUE_IN)
    },

    /** Whether the entity is a Sole Proprietorship or General Partnership. */
    isEntityFirm (): boolean {
      return (this.isEntitySoleProp || this.isEntityPartnership)
    },

    /** The Account Information object. */
    getAccountInformation (): AccountInformationIF {
      return this.stateModel.accountInformation
    },

    /** The current account id. */
    getAccountId (): number {
      return this.getAccountInformation?.id
    },

    /** Whether the entity is a base company (BC/BEN/CC/ULC or C/CBEN/CCC/CUL). */
    isBaseCompany (): boolean {
      return (
        this.isEntityBcCompany ||
        this.isEntityBenefitCompany ||
        this.isEntityBcCcc ||
        this.isEntityBcUlcCompany ||
        this.isEntityContinueIn ||
        this.isEntityBenContinueIn ||
        this.isEntityCccContinueIn ||
        this.isEntityUlcContinueIn
      )
    },

    /** The Org Information object. */
    getOrgInformation (): OrgInformationIF {
      return this.stateModel.orgInformation
    },

    /** The current date, which is refreshed every time the app inits (YYYY-MM-DD). */
    getCurrentDate (): string {
      return this.stateModel.currentDate
    },

    /** The current JS Date object, which is refreshed every minute. */
    getCurrentJsDate (): Date {
      return this.stateModel.currentJsDate
    },

    /** The Filing ID. */
    getFilingId (): number {
      return this.stateModel.filingId
    },

    /** The Temporary Business Identifier. */
    getTempId (): string {
      return this.stateModel.tempId
    },

    /** The Business Identifier. */
    getBusinessId (): string {
      return this.stateModel.business.businessId
    },

    /** The Business Number (aka Tax ID). */
    getBusinessNumber (): string {
      return this.stateModel.business.taxId
    },

    getEntityIdentifier (): string {
      switch (this.getFilingType) {
        case FilingTypes.AMALGAMATION_APPLICATION: return this.getTempId
        case FilingTypes.CONTINUATION_IN: return this.getTempId
        case FilingTypes.INCORPORATION_APPLICATION: return this.getTempId
        case FilingTypes.REGISTRATION: return this.getTempId
        case FilingTypes.RESTORATION: return this.getBusinessId
        case FilingTypes.DISSOLUTION: return this.getBusinessId
      }
    },

    /** The Business Legal Name (or Alternate Name if this is a firm). */
    getBusinessLegalName (): string {
      if (!GetFeatureFlag('enable-legal-name-fix')) {
        return this.stateModel.business.legalName
      }
      if (this.isEntityFirm) return this.stateModel.alternateName || 'Unknown'
      return this.stateModel.business.legalName
    },

    /** The Business Founding Date. */
    getBusinessFoundingDate (): string {
      return this.stateModel.business.foundingDate
    },

    /** The Business Start Date. */
    getBusinessStartDate (): string {
      return this.stateModel.business.startDate
    },

    /** The Business Office Address. */
    getBusinessOfficeAddress (): OfficeAddressIF {
      return this.stateModel.business.officeAddress
    },

    /** The Correct Name Option. */
    getCorrectNameOption (): CorrectNameOptions {
      return this.stateModel.correctNameOption
    },

    /** The Name Request object. */
    getNameRequest (): NameRequestIF {
      return this.stateModel.nameRequest
    },

    /** The Name Request applicant (may be empty object). */
    getNameRequestApplicant (): NrApplicantIF {
      return this.getNameRequest.applicants // object not array
    },

    /** The approved name (from NR or Correct Name component). */
    getNameRequestApprovedName (): string {
      return this.stateModel.nameRequestApprovedName
    },

    /** The Name Request number. */
    getNameRequestNumber (): string {
      return this.getNameRequest.nrNum
    },

    /** The Company Step object. */
    getDefineCompanyStep (): DefineCompanyIF {
      return this.stateModel.defineCompanyStep
    },

    /** The Continuation In object. */
    getContinuationIn (): ContinuationInStateIF {
      return this.stateModel.continuationIn
    },

    /** The Cooperative association type. */
    getCooperativeType (): CoopTypes {
      return this.getDefineCompanyStep.cooperativeType
    },

    /** The Business Contact object. */
    getBusinessContact (): ContactPointIF {
      return this.stateModel.businessContact
    },

    /** The Memorandum object. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getMemorandum (): any {
      return {} // FUTURE: implement this
    },

    /** The Add People and Role object. */
    getAddPeopleAndRoleStep (): PeopleAndRoleIF {
      return this.stateModel.addPeopleAndRoleStep
    },

    /** The Create Share Structure object. */
    getCreateShareStructureStep (): ShareStructureIF {
      return this.stateModel.createShareStructureStep
    },

    /** The Create Rules object. */
    getCreateRulesStep (): CreateRulesIF {
      return this.stateModel.createRulesStep
    },

    /** Is true when the step is valid. */
    isRulesValid (): boolean {
      return this.getCreateRulesStep.validationDetail.valid
    },

    /** The Incorporation Agreement object. */
    getIncorporationAgreementStep (): IncorporationAgreementIF {
      return this.stateModel.incorporationAgreementStep
    },

    /** Is true when the step is valid. */
    isMemorandumValid (): boolean {
      return this.getCreateMemorandumStep.validationDetail.valid
    },

    /** The Create Memorandum object. */
    getCreateMemorandumStep (): CreateMemorandumIF {
      return this.stateModel.createMemorandumStep
    },

    /** Is true when the step is valid. */
    isAffidavitValid (): boolean {
      if (this.isEntityCoop) {
        return this.getAffidavitStep.validationDetail.valid
      } else {
      // Just validate the confirm checkbox for Corps
        return this.getAffidavitStep.validationDetail.validationItemDetails[0]?.valid
      }
    },

    /** The upload Affidavit object. */
    getAffidavitStep (): UploadAffidavitIF {
      return this.stateModel.uploadAffidavitStep
    },

    /** Is true when the step is valid. */
    isResolutionValid (): boolean {
      return this.getCreateResolutionStep.validationDetail.valid
    },

    /** The Create Special Resolution object. */
    getCreateResolutionStep (): CreateResolutionIF {
      return this.stateModel.createResolutionStep
    },

    /** The Effective Date-Time object. */
    getEffectiveDateTime (): EffectiveDateTimeIF {
      return this.stateModel.effectiveDateTime
    },

    /** The Name Translations object array. */
    getNameTranslations (): NameTranslationIF[] {
      return this.stateModel.nameTranslations
    },

    /** The Name Translations oject validity. */
    getNameTranslationsValid (): boolean {
      return this.stateModel.nameTranslationsValid
    },

    /** Whether we are ignoring data changes. */
    ignoreChanges (): boolean {
      return this.stateModel.ignoreChanges
    },

    /** Whether there are unsaved data changes. */
    getHaveChanges (): boolean {
      return this.stateModel.haveChanges
    },

    //
    // Below is the business logic that allows the Stepper, the Actions, etc
    // to know how they should behave (ie, what to show or enable).
    //

    /** The current step. */
    getCurrentStep (): number {
      return this.stateModel.currentStep
    },

    /** Whether the app is busy saving. */
    isSaving (): boolean {
      return this.stateModel.isSaving
    },

    /** Whether the app is busy saving and resuming. */
    isSavingResuming (): boolean {
      return this.stateModel.isSavingResuming
    },

    /** Whether the app is busy filing and paying. */
    isFilingPaying (): boolean {
      return this.stateModel.isFilingPaying
    },

    /** Whether the "next" button should be displayed. */
    isShowNextBtn (): boolean {
      return (!!this.getEntityType && this.getCurrentStep < this.getMaxStep)
    },

    /** Whether the File and Pay button should be displayed. */
    isShowFilePayBtn (): boolean {
      return (this.getCurrentStep === this.getMaxStep)
    },

    /** Whether the app is busy saving or resuming. */
    isBusySaving (): boolean {
      return (this.isSaving || this.isSavingResuming || this.isFilingPaying)
    },

    /** Whether the Define Company step is valid. */
    isDefineCompanyValid (): boolean {
      if (this.isEntityCoop) {
        return (!!this.getCooperativeType && this.getDefineCompanyStep.valid)
      }
      return this.getDefineCompanyStep.valid
    },

    /** Whether the Continuation Authorization page is valid. */
    isContinuationAuthorizationPageValid (): boolean {
      return this.getContinuationIn.continuationAuthorizationPageValid
    },

    /** Whether the Restore Business Name step is valid. */
    isRestoreBusinessNameValid (): boolean {
      return (
        this.getRestorationBusinessNameValid &&
        this.getNameTranslationsValid &&
        this.getRestorationTypeValid &&
        this.getApprovalTypeValid
      )
    },

    /** Whether the Add People And Roles step is valid. */
    isAddPeopleAndRolesValid (): boolean {
      return this.getAddPeopleAndRoleStep.valid
    },

    /** Whether the Create Share Structure step is valid. */
    isCreateShareStructureValid (): boolean {
      return this.getCreateShareStructureStep.valid
    },

    /** Whether the Incorporation Agreement step is valid. */
    isIncorporationAgreementValid (): boolean {
      return this.getIncorporationAgreementStep.valid
    },

    /** Whether the subject filing is valid. */
    isFilingValid (): boolean {
      if (this.isAmalgamationFiling) return this.isAmalgamationValid
      if (this.isContinuationInFiling) return this.isContinuationInValid
      if (this.isIncorporationFiling) return this.isIncorporationApplicationValid
      if (this.isDissolutionFiling) return this.isDissolutionValid
      if (this.isRegistrationFiling) return this.isRegistrationValid
      if (this.isRestorationFiling) return this.isRestorationValid
      return false // should never happen
    },

    /** Whether all the dissolution steps are valid. */
    isDissolutionValid (): boolean {
      const isDocumentDeliveryValid = this.getDocumentDelivery.valid
      const isCertifyValid = this.getCertifyState.valid && !!this.getCertifyState.certifiedBy
      const isCourtOrderValid = IsAuthorized(AuthorizedActions.COURT_ORDER_POA)
        ? this.getCourtOrderStep.valid
        : true
      const isStaffPaymentValid = IsAuthorized(AuthorizedActions.STAFF_PAYMENT)
        ? this.getStaffPaymentStep.valid
        : true
      // transactional folio number is mutually exclusive with staff payment
      const isTransactionalFolioNumberValid = !IsAuthorized(AuthorizedActions.STAFF_PAYMENT)
        ? this.getTransactionalFolioNumberValid
        : true

      if (this.isEntityFirm) {
        const isDissolutionDateValid = !!this.getDissolutionDate
        const isCompletingPartyValid = IsAuthorized(AuthorizedActions.EDITABLE_COMPLETING_PARTY)
          ? this.getCompletingParty?.valid
          : true

        return (
          isDocumentDeliveryValid &&
          isTransactionalFolioNumberValid &&
          isCertifyValid &&
          isCourtOrderValid &&
          isStaffPaymentValid &&
          isDissolutionDateValid &&
          isCompletingPartyValid
        )
      } else {
        const isEffectiveDateTimeValid = this.isBaseCompany ? this.getEffectiveDateTime.valid : true

        return (
          this.isDissolutionDefineDissolutionValid &&
          this.isAffidavitValid &&
          this.isResolutionValid &&
          isDocumentDeliveryValid &&
          isTransactionalFolioNumberValid &&
          isCertifyValid &&
          isEffectiveDateTimeValid &&
          isCourtOrderValid &&
          isStaffPaymentValid
        )
      }
    },

    /** Whether Amalgamation Information step is valid. */
    isAmalgamationInformationValid (): boolean {
      if (this.isAmalgamationFilingRegular) {
        return (
          this.getAmalgamatingBusinessesValid &&
          !!this.getCorrectNameOption &&
          this.getNameTranslationsValid
        )
      } else {
        return (
          this.getAmalgamatingBusinessesValid &&
          // NB - this is the only valid Correct Name Option for short-form amalgamations:
          (this.getCorrectNameOption === CorrectNameOptions.CORRECT_AML_ADOPT)
          // NB - there are no name translations for short-form amalgamations
        )
      }
    },

    /** Whether all the amalgamation steps are valid. */
    isAmalgamationValid (): boolean {
      const isCreateShareStructureValid = (
        this.isAmalgamationFilingHorizontal ||
        this.isAmalgamationFilingVertical ||
        this.isCreateShareStructureValid
      )

      const isCourtOrderValid = IsAuthorized(AuthorizedActions.COURT_ORDER_POA)
        ? this.getCourtOrderStep.valid
        : true
      const isCertifyValid = (this.getCertifyState.valid && !!this.getCertifyState.certifiedBy)
      const isStaffPaymentValid = IsAuthorized(AuthorizedActions.STAFF_PAYMENT)
        ? this.getStaffPaymentStep.valid
        : true
      // folio number is mutually exclusive with staff payment
      const isFolioNumberValid = !IsAuthorized(AuthorizedActions.STAFF_PAYMENT)
        ? this.getFolioNumberValid
        : true
      return (
        this.isAmalgamationInformationValid &&
        this.isDefineCompanyValid &&
        this.isAddPeopleAndRolesValid &&
        isCreateShareStructureValid &&
        this.getEffectiveDateTime.valid &&
        isFolioNumberValid &&
        this.getAmalgamationCourtApprovalValid &&
        isCourtOrderValid &&
        isCertifyValid &&
        isStaffPaymentValid
      )
    },

    /** Whether all the continuation in steps are valid. */
    isContinuationInValid (): boolean {
      // special case for continuation in authorization
      if (this.isContinuationInAuthorization) {
        return this.isContinuationAuthorizationPageValid
      }

      // otherwise, it's a continuation in application
      const isEffectiveDateTimeValid =
        (this.getFilingStatus === FilingStatus.DRAFT) ? this.getEffectiveDateTime.valid : true
      const isCertifyValid = (this.getCertifyState.valid && !!this.getCertifyState.certifiedBy)
      const isCourtOrderValid = IsAuthorized(AuthorizedActions.COURT_ORDER_POA)
        ? this.getCourtOrderStep.valid
        : true
      const isStaffPaymentValid =
        (IsAuthorized(AuthorizedActions.STAFF_PAYMENT) && this.getFilingStatus === FilingStatus.DRAFT)
          ? this.getStaffPaymentStep.valid
          : true

      return (
        this.isDefineCompanyValid &&
        this.isAddPeopleAndRolesValid &&
        this.isCreateShareStructureValid &&
        isEffectiveDateTimeValid &&
        isCertifyValid &&
        isCourtOrderValid &&
        isStaffPaymentValid
      )
    },

    /** Whether all the incorporation steps are valid. */
    isIncorporationApplicationValid (): boolean {
      // Base company steps
      const isBaseStepsValid = (
        this.isCreateShareStructureValid &&
        this.getEffectiveDateTime.valid &&
        this.isIncorporationAgreementValid
      )

      // Coop steps
      const isCoopStepsValid = (
        this.getCooperativeType &&
        this.getCreateRulesStep.validationDetail.valid &&
        this.getCreateMemorandumStep.validationDetail.valid
      )

      // Validate different steps for Base Companies vs Coops
      const isDocumentValid = this.isBaseCompany ? isBaseStepsValid : isCoopStepsValid

      const isCertifyValid = (this.getCertifyState.valid && !!this.getCertifyState.certifiedBy)

      const isCourtOrderValid = (this.isBaseCompany && IsAuthorized(AuthorizedActions.COURT_ORDER_POA))
        ? this.getCourtOrderStep.valid
        : true

      const isStaffPaymentValid = IsAuthorized(AuthorizedActions.STAFF_PAYMENT)
        ? this.getStaffPaymentStep.valid
        : true

      return (
        this.isDefineCompanyValid &&
        this.isAddPeopleAndRolesValid &&
        isDocumentValid &&
        isCertifyValid &&
        isCourtOrderValid &&
        isStaffPaymentValid
      )
    },

    /** Whether all the registration steps are valid. */
    isRegistrationValid (): boolean {
      const isCertifyValid = (this.getCertifyState.valid && !!this.getCertifyState.certifiedBy)
      // const isFeeAcknowledgementValid = getRegistration.feeAcknowledgement
      const isFeeAcknowledgementValid = true // FUTURE: use line above instead
      const isStaffPaymentValid = IsAuthorized(AuthorizedActions.STAFF_PAYMENT)
        ? this.getStaffPaymentStep.valid
        : true

      return (
        this.getRegistration.defineBusinessValid &&
        this.isAddPeopleAndRolesValid &&
        isCertifyValid &&
        isFeeAcknowledgementValid &&
        isStaffPaymentValid
      )
    },

    /** Whether all the restoration steps are valid. */
    isRestorationValid (): boolean {
      const isCertifyValid = (this.getCertifyState.valid && !!this.getCertifyState.certifiedBy)
      const isStaffPaymentValid = IsAuthorized(AuthorizedActions.STAFF_PAYMENT)
        ? this.getStaffPaymentStep.valid
        : true

      return (
        this.isRestoreBusinessNameValid && // step 1
        this.isAddPeopleAndRolesValid && // step 2
        this.isDefineCompanyValid && // step 3
        isCertifyValid && // step 4
        isStaffPaymentValid // step 4
      )
    },

    /**
     * Is true when the user has tried to submit a filing,
     * ie, after clicking File and Pay.
     */
    getValidateSteps (): boolean {
      return this.stateModel.validateSteps
    },

    /**
     * Is true when the user should see the validation errors,
     * ie, after navigating to review page.
     */
    getShowErrors (): boolean {
      return this.stateModel.showErrors
    },

    /** The Certify State object. */
    getCertifyState (): CertifyIF {
      return this.stateModel.certifyState
    },

    /** The users's email address. */
    getUserEmail (): string {
      return this.stateModel.tombstone.userEmail
    },

    /** The users's phone number. */
    getUserPhone (): string {
      return this.stateModel.tombstone.userPhone
    },

    /** The user's first name. */
    getUserFirstName (): string {
      return this.stateModel.tombstone.userFirstName
    },

    /** The user's last name. */
    getUserLastName (): string {
      return this.stateModel.tombstone.userLastName
    },

    /** The user's GUID from the Keycloak token (JWT). */
    getKeycloakGuid (): string {
      return this.stateModel.tombstone.keycloakGuid
    },

    /** The user's authorized actions (aka permissions). */
    getAuthorizedActions (): Array<AuthorizedActions> {
      return this.stateModel.tombstone.authorizedActions
    },

    /** The user's address. */
    getUserAddress (): AddressIF {
      return (this.stateModel.tombstone.userAddress)
    },

    /** The fee prices. */
    getFeePrices (): Array<FeesIF> {
      return this.stateModel.feePrices
    },

    /** The staff payment step. */
    getStaffPaymentStep (): StaffPaymentStepIF {
      return this.stateModel.staffPaymentStep
    },

    /** The court order step this. */
    getCourtOrderStep (): CourtOrderStepIF {
      return this.stateModel.courtOrderStep
    },

    getDocumentDelivery (): DocumentDeliveryIF {
      return this.stateModel.documentDelivery
    },

    /** The amalgamation type. */
    getAmalgamationType (): AmalgamationTypes {
      return this.stateModel.amalgamation.type
    },

    /** The restoration object. */
    getRestoration (): RestorationStateIF {
      return this.stateModel.restoration
    },

    /** The restoration business name validity. */
    getRestorationBusinessNameValid (): boolean {
      return this.stateModel.restoration.businessNameValid
    },

    /** The restoration type validity. */
    getRestorationTypeValid (): boolean {
      return this.stateModel.restoration.restorationTypeValid
    },

    /** The approval type validity. */
    getApprovalTypeValid (): boolean {
      return this.stateModel.restoration.approvalTypeValid
    },

    /** The amalgamating businesses. */
    getAmalgamatingBusinesses (): Array<AmalgamatingBusinessIF> {
      return this.stateModel.amalgamation.amalgamatingBusinesses
    },

    /** The amalgamating businesses validity. */
    getAmalgamatingBusinessesValid (): boolean {
      return this.stateModel.amalgamation.amalgamatingBusinessesValid
    },

    /** The amalgamation court approval. */
    getAmalgamationCourtApproval (): boolean {
      return this.stateModel.amalgamation.courtApproval
    },

    /** The amalgamation court approval validity. */
    getAmalgamationCourtApprovalValid (): boolean {
      return this.stateModel.amalgamation.courtApprovalValid
    },

    //
    // Dissolution getters
    //

    /** The dissolution object. */
    getDissolution (): DissolutionStateIF {
      return this.stateModel.dissolution
    },

    /** The dissolution statement step. */
    getDissolutionStatementStep (): DissolutionStatementIF {
      return this.getDissolution.dissolutionStatementStep
    },

    /** The dissolution type. */
    getDissolutionType (): DissolutionTypes {
      return this.getDissolution.dissolutionType
    },

    getDissolutionHasCertificateDestroyed (): boolean {
      return this.getDissolution.hasCertificateDestroyed
    },

    /** Is true when the custodian data is valid. */
    isDissolutionCustodianValid (): boolean {
      return this.getDissolution.custodianOfRecords.valid
    },

    /** The dissolution custodian of records. */
    getDissolutionCustodian (): OrgPersonIF {
      return this.getDissolution.custodianOfRecords.custodian
    },

    /** The custodian email. */
    getDissolutionCustodianEmail (): string {
      return this.getDissolutionCustodian?.officer.email
    },

    /** Is true when the Define Dissolution page is valid. */
    isDissolutionDefineDissolutionValid (): boolean {
      const isCoopDefineDissolutionValid = this.isEntityCoop
        ? (this.getDissolutionStatementStep.valid && this.getDissolutionHasCertificateDestroyed)
        : true

      return isCoopDefineDissolutionValid && this.isDissolutionCustodianValid
    },

    /** The registration object. */
    getRegistration (): RegistrationStateIF {
      return this.stateModel.registration
    },

    /** The completing party data. */
    getCompletingParty (): CompletingPartyIF {
      return this.stateModel.completingParty
    },

    /** The dissolution date. */
    getDissolutionDate (): string {
      return this.getDissolution.dissolutionDate
    },

    /** The parties list. */
    getParties (): Array<PartyIF> {
      return this.stateModel.parties
    },

    /** The resolutions list. */
    getResolutions (): ResolutionIF[] {
      return this.stateModel.resolutions
    },

    //
    // The getters below return values from the current resource
    // model -- in other words, for the currently-selected entity type.
    //

    /** The company display name. */
    getCompanyDisplayName (): string {
      return this.resourceModel.displayName
    },

    /** The People and Roles object. */
    getPeopleAndRolesResource (): PeopleAndRolesResourceIF {
      return this.resourceModel.peopleAndRoles
    },

    /** The Incorporation Articles. */
    getIncorporationArticlesResource (): any {
      return this.resourceModel.incorporationArticles
    },

    /** The Create Rules object. */
    getCreateRulesResource (): CreateRulesResourceIF {
      return this.resourceModel.createRules
    },

    /** The Create Memorandum object. */
    getCreateMemorandumResource (): CreateMemorandumResourceIF {
      return this.resourceModel.createMemorandum
    },

    /** The Create Resolution object. */
    getCreateResolutionResource (): CreateResolutionResourceIF {
      return this.resourceModel.createResolution
    },

    /** The completing party statement object. */
    getCompletingPartyStatement (): CompletingPartyStatementIF {
      return this.resourceModel.reviewAndConfirm.completingPartyStatement
    },

    /** The Incoporation Agreement object. */
    getIncorporationAgreementResource (): any {
      return this.resourceModel.incorporationAgreement
    },

    /** The array of steps. */
    getSteps (): Array<StepIF> {
      return this.resourceModel.steps
    },

    /** The resource filing data. */
    getFilingData (): Array<FilingDataIF> {
      switch (true) {
        case this.isFullRestorationFiling: return [this.resourceModel.filingData[0]]
        case this.isLimitedRestorationFiling: return [this.resourceModel.filingData[1]]
        case (this.isRestorationFiling && !this.isFullRestorationFiling && !this.isLimitedRestorationFiling): return []
        case this.isAmalgamationFilingHorizontal: return [this.resourceModel.filingData[0]]
        case this.isAmalgamationFilingVertical: return [this.resourceModel.filingData[1]]
        default: return this.resourceModel.filingData
      }
    },

    /** The incorporation agreement sample article. */
    getSampleArticle (): string {
      return this.getIncorporationAgreementResource.article
    },

    /** The incorporation agreement options. */
    getIncorporationAgreementDocuments (): Array<IncorporationAgreementTypeIF> {
      return this.getIncorporationAgreementResource.documents
    },

    /** The maximum number of steps. */
    getMaxStep (): number {
      const steps = this.getSteps
      return (steps ? steps.filter(step => step.step !== -1).length : -1)
    },

    /** The page blurb. Only valid in Draft or Change Requested status. */
    getPageBlurb (): string {
      return [FilingStatus.DRAFT, FilingStatus.CHANGE_REQUESTED].includes(this.getFilingStatus)
        ? this.resourceModel.pageBlurbDraft
        : null
    },

    /** The details title. Used for dissolutions only atm. */
    getDetailsTitle (): string {
      return this.resourceModel.detailsTitle
    },

    /** The dissolution statement options. */
    getDissolutionStatements (): Array<KeyValueIF> {
      return this.resourceModel.dissolutionStatements
    },

    /** The dissolution custodial records resources. */
    getCustodialRecords (): CustodianResourceIF {
      return this.resourceModel.custodialRecords
    },

    /** The dissolution statement options. */
    getAffidavitResources (): AffidavitResourceIF {
      return this.resourceModel.affidavit
    }
  },
  actions: {
    setBusinessId (businessId: string) {
      this.stateModel.business.businessId = businessId
    },
    setBusinessAddress (address: OfficeAddressIF) {
      this.stateModel.business.officeAddress = address
    },
    setBusinessStartDate (startDate: string) {
      this.stateModel.business.startDate = startDate
    },
    setLegalName (legalName: string) {
      this.stateModel.business.legalName = legalName
    },
    setFoundingDate (foundingDate: string) {
      this.stateModel.business.foundingDate = foundingDate
    },
    setAlternateName (name: string) {
      this.stateModel.alternateName = name
    },
    setFilingType (filingType: FilingTypes) {
      this.stateModel.tombstone.filingType = filingType
    },
    setFilingStatus (filingStatus: FilingStatus) {
      this.stateModel.tombstone.filingStatus = filingStatus
    },
    setDissolutionType (dissolutionType: DissolutionTypes) {
      this.stateModel.dissolution.dissolutionType = dissolutionType
    },
    setEntityType (entityType: CorpTypeCd) {
      this.stateModel.entityType = entityType
    },
    setResources (resources: ResourceIF) {
      this.resourceModel = resources
    },
    setTempId (tempId: string) {
      this.stateModel.tempId = tempId
    },
    setCurrentStep (currentStep: number) {
      this.stateModel.currentStep = currentStep
    },
    setIsSaving (isSaving: boolean) {
      this.stateModel.isSaving = isSaving
    },
    setIsSavingResuming (isSavingResuming: boolean) {
      this.stateModel.isSavingResuming = isSavingResuming
    },
    setIsFilingPaying (isFilingPaying: boolean) {
      this.stateModel.isFilingPaying = isFilingPaying
    },
    setUserEmail (userEmail: string) {
      this.stateModel.tombstone.userEmail = userEmail
    },
    setUserPhone (userPhone: string) {
      this.stateModel.tombstone.userPhone = userPhone
    },
    setUserFirstName (userFirstName: string) {
      this.stateModel.tombstone.userFirstName = userFirstName
    },
    setUserLastName (userLastName: string) {
      this.stateModel.tombstone.userLastName = userLastName
    },
    setKeycloakGuid (keycloakGuid: string) {
      this.stateModel.tombstone.keycloakGuid = keycloakGuid
    },
    setAuthorizedActions (actions: Array<AuthorizedActions>) {
      this.stateModel.tombstone.authorizedActions = actions
    },
    setUserAddress (userAddress: AddressIF) {
      this.stateModel.tombstone.userAddress = userAddress
    },
    setCurrentDate (currentDate: string) {
      this.stateModel.currentDate = currentDate
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setCurrentJsDate (date: Date) {
      this.stateModel.currentJsDate = date
    },
    setContinuationAuthorization (val: AuthorizationProofIF) {
      this.stateModel.continuationIn.authorizationProof = val
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setExistingBusinessInfo (val: ExistingBusinessInfoIF) {
      this.stateModel.continuationIn.existingBusinessInfo = val
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setIsFutureEffective (isFutureEffective: boolean) {
      this.stateModel.effectiveDateTime.isFutureEffective = isFutureEffective
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setEffectiveDate (effectiveDate: Date) {
      this.stateModel.effectiveDateTime.effectiveDate = effectiveDate
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setEffectiveDateTimeValid (effectiveDateTimeValid: boolean) {
      this.stateModel.effectiveDateTime.valid = effectiveDateTimeValid
    },
    setCertifyState (certifyState: CertifyIF) {
      this.stateModel.certifyState = certifyState
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setBusinessContact (businessContact: ContactPointIF) {
      this.stateModel.businessContact = businessContact
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setCooperativeType (cooperativeType: CoopTypes) {
      this.stateModel.defineCompanyStep.cooperativeType = cooperativeType
    },
    setDefineCompanyStepValidity (valid: boolean) {
      this.stateModel.defineCompanyStep.valid = valid
    },
    setContinuationAuthorizationPageValid (valid: boolean) {
      this.getContinuationIn.continuationAuthorizationPageValid = valid
    },
    setOfficeAddresses (addresses: RegisteredRecordsAddressesIF) {
      this.stateModel.defineCompanyStep.officeAddresses = addresses
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setFolioNumber (folioNumber: string) {
      this.stateModel.tombstone.folioNumber = folioNumber
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setFolioNumberValidity (valid: boolean) {
      this.stateModel.tombstone.folioNumberValid = valid
    },
    setTransactionalFolioNumber (folioNumber: string) {
      this.stateModel.tombstone.transactionalFolioNumber = folioNumber
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setTransactionalFolioNumberValidity (valid: boolean) {
      this.stateModel.tombstone.transactionalFolioNumberValid = valid
    },
    setAccountInformation (accountInfo: AccountInformationIF) {
      this.stateModel.accountInformation = accountInfo
    },
    setOrgInformation (orgInfo: OrgInformationIF) {
      this.stateModel.orgInformation = orgInfo
    },
    setNameRequest (nameRequest: NameRequestIF) {
      this.stateModel.nameRequest = nameRequest
    },
    setNameRequestApprovedName (name: string) {
      this.stateModel.nameRequestApprovedName = name
    },
    setCorrectNameOption (option: CorrectNameOptions) {
      this.stateModel.correctNameOption = option
    },
    setNameTranslations (nameTranslations: NameTranslationIF[]) {
      this.stateModel.nameTranslations = nameTranslations
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setNameTranslationsValid (valid: boolean) {
      this.stateModel.nameTranslationsValid = valid
    },
    setFilingId (filingId: number) {
      this.stateModel.filingId = filingId
    },
    setOrgPersonList (orgPeople: OrgPersonIF[]) {
      this.stateModel.addPeopleAndRoleStep.orgPeople = orgPeople
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setAddPeopleAndRoleStepValidity (valid: boolean) {
      this.stateModel.addPeopleAndRoleStep.valid = valid
    },
    setRules (rules: CreateRulesIF) {
      this.stateModel.createRulesStep = rules
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRulesStepValidity (validationDetail: ValidationDetailIF) {
      this.stateModel.createRulesStep.validationDetail = validationDetail
    },
    setMemorandum (memorandum: CreateMemorandumIF) {
      this.stateModel.createMemorandumStep = memorandum
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setMemorandumStepValidity (validationDetail: ValidationDetailIF) {
      this.stateModel.createMemorandumStep.validationDetail = validationDetail
    },
    setAffidavit (affidavit: UploadAffidavitIF) {
      this.stateModel.uploadAffidavitStep = affidavit
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setAffidavitStepValidity (validationDetail: ValidationDetailIF) {
      this.stateModel.uploadAffidavitStep.validationDetail = validationDetail
    },
    setResolution (resolution: CreateResolutionIF) {
      this.stateModel.createResolutionStep = resolution
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setResolutionStepValidationDetail (validationDetail: ValidationDetailIF) {
      this.stateModel.createResolutionStep.validationDetail = validationDetail
    },
    setShareClasses (shareClasses: ShareClassIF[]) {
      this.stateModel.createShareStructureStep.shareClasses = shareClasses
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setCreateShareStructureStepValidity (valid: boolean) {
      this.stateModel.createShareStructureStep.valid = valid
    },
    setIncorporationAgreementStepData (stepData: IncorporationAgreementIF) {
      this.stateModel.incorporationAgreementStep = stepData
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setIgnoreChanges (ignoreChanges: boolean) {
      this.stateModel.ignoreChanges = ignoreChanges
    },
    setHaveChanges (haveChanges: boolean) {
      this.stateModel.haveChanges = haveChanges
    },
    setValidateSteps (validateSteps: boolean) {
      this.stateModel.validateSteps = validateSteps
    },
    setShowErrors (showErrors: boolean) {
      this.stateModel.showErrors = showErrors
    },
    setDissolutionStatementStepData (stepData: DissolutionStatementIF) {
      this.stateModel.dissolution.dissolutionStatementStep = stepData
    },
    setFeePrices (feePrices: Array<FeesIF>) {
      this.stateModel.feePrices = feePrices
    },
    setStaffPayment (staffPayment: StaffPaymentIF) {
      this.stateModel.staffPaymentStep.staffPayment = staffPayment
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setStaffPaymentValidity (validity: boolean) {
      this.stateModel.staffPaymentStep.valid = validity
    },
    setCourtOrderFileNumber (courtOrderNumber: string) {
      this.stateModel.courtOrderStep.courtOrder.fileNumber = courtOrderNumber
    },
    setHasPlanOfArrangement (hasPoa: boolean) {
      this.stateModel.courtOrderStep.courtOrder.hasPlanOfArrangement = hasPoa
    },
    setCourtOrderValidity (validity: boolean) {
      this.stateModel.courtOrderStep.valid = validity
    },
    setDocumentOptionalEmail (documentOptionalEmail: string) {
      this.stateModel.documentDelivery.documentOptionalEmail = documentOptionalEmail
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setDocumentOptionalEmailValidity (validity: boolean) {
      this.stateModel.documentDelivery.valid = validity
    },
    setHasCertificateDestroyed (hasCertificateDestroyed: boolean) {
      this.stateModel.dissolution.hasCertificateDestroyed = hasCertificateDestroyed
    },
    setCustodianValidity (validity: boolean) {
      this.stateModel.dissolution.custodianOfRecords.valid = validity
    },
    setCustodianOfRecords (custodian: OrgPersonIF) {
      this.stateModel.dissolution.custodianOfRecords.custodian = custodian
    },
    setRegistrationDefineBusinessValid (val: boolean) {
      this.stateModel.registration.defineBusinessValid = val
    },
    setRegistrationStartDate (val: string) {
      this.stateModel.registration.startDate = val
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRegistrationBusinessAddress (val: BusinessAddressIF) {
      this.stateModel.registration.businessAddress = val
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRegistrationFeeAcknowledgement (val: boolean) {
      this.stateModel.registration.feeAcknowledgement = val
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRegistrationNaics (val: NaicsIF) {
      this.stateModel.registration.naics = val
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRegistrationBusinessNumber (val: string) {
      this.stateModel.registration.businessNumber = val
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setIsAutoPopulatedBusinessNumber (val: boolean) {
      this.stateModel.registration.isAutoPopulatedBusinessNumber = val
    },
    setRegistrationBusinessType (businessType: BusinessTypes) {
      this.stateModel.registration.businessType = businessType
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRegistrationBusinessTypeConfirm (businessTypeConfirm: boolean) {
      this.stateModel.registration.businessTypeConfirm = businessTypeConfirm
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setCompletingParty (cp: CompletingPartyIF) {
      this.stateModel.completingParty = cp
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setCompletingPartyValidity (validity: boolean) {
      this.stateModel.completingParty.valid = validity
    },
    setDissolutionDate (dissolutionDate: string) {
      this.stateModel.dissolution.dissolutionDate = dissolutionDate
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setParties (parties: Array<PartyIF>) {
      this.stateModel.parties = parties
    },
    setResolutions (resolutions: ResolutionIF[]) {
      this.stateModel.resolutions = resolutions
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setAdminFreeze (adminFreeze: boolean) {
      this.stateModel.business.adminFreeze = adminFreeze
    },
    setEntityState (entityState: EntityStates) {
      this.stateModel.business.state = entityState
    },
    setBusinessNumber (taxId: string) {
      this.stateModel.business.taxId = taxId
    },
    setGoodStanding  (goodStanding: boolean) {
      this.stateModel.business.goodStanding = goodStanding
    },
    setIdentifier (identifier: string) {
      this.stateModel.business.identifier = identifier
    },
    setLastAnnualReportDate (date: string) {
      this.stateModel.business.lastAnnualReportDate = date
    },
    setLastAddressChangeDate (date: string) {
      this.stateModel.business.lastAddressChangeDate = date
    },
    setLastDirectorChangeDate (date: string) {
      this.stateModel.business.lastDirectorChangeDate = date
    },
    setWarnings  (businessWarnings: Array<BusinessWarningIF>) {
      this.stateModel.business.warnings = businessWarnings
    },
    setWindowWidth (width: number) {
      this.stateModel.windowWidth = width
    },

    //
    // alamgamation-specific setters
    //
    setAmalgamatingBusinesses (amalgamatingBusinesses: Array<AmalgamatingBusinessIF>) {
      this.stateModel.amalgamation.amalgamatingBusinesses = amalgamatingBusinesses
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    /** Adds specified item to end of amalgamating businesses list. */
    pushAmalgamatingBusiness (item: AmalgamatingBusinessIF) {
      this.stateModel.amalgamation.amalgamatingBusinesses.push(item)
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    /** Deletes item at specified index from amalgamating businesses list. */
    spliceAmalgamatingBusiness (index: number) {
      this.stateModel.amalgamation.amalgamatingBusinesses.splice(index, 1)
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setAmalgamatingBusinessesValid (valid: boolean) {
      this.stateModel.amalgamation.amalgamatingBusinessesValid = valid
    },
    setAmalgamationCourtApproval (courtApproval: boolean) {
      this.stateModel.amalgamation.courtApproval = courtApproval
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setAmalgamationCourtApprovalValid (valid: boolean) {
      this.stateModel.amalgamation.courtApprovalValid = valid
    },
    setAmalgamationType (type: AmalgamationTypes) {
      this.stateModel.amalgamation.type = type
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },

    //
    // restoration-specific setters
    //
    setRestorationApplicationDate (date: string) {
      this.stateModel.restoration.applicationDate = date
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRestorationApprovalType (type: ApprovalTypes) {
      this.stateModel.restoration.approvalType = type
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRestorationApprovalTypeValid (valid: boolean) {
      this.stateModel.restoration.approvalTypeValid = valid
    },
    setRestorationBusinessNameValid (valid: boolean) {
      this.stateModel.restoration.businessNameValid = valid
    },
    setRestorationCourtOrder (courtOrder: CourtOrderIF) {
      this.stateModel.restoration.courtOrder = courtOrder
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRestorationExpiry (expiry: string) {
      this.stateModel.restoration.expiry = expiry
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRestorationNoticeDate (date: string) {
      this.stateModel.restoration.noticeDate = date
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRestorationRelationships (relationships: RelationshipTypes[]) {
      this.stateModel.restoration.relationships = relationships
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRestorationType (type: RestorationTypes) {
      this.stateModel.restoration.type = type
      if (!this.stateModel.ignoreChanges) this.stateModel.haveChanges = true
    },
    setRestorationTypeValid (valid: boolean) {
      this.stateModel.restoration.restorationTypeValid = valid
    }
  }
})
