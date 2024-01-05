import { Component, Mixins } from 'vue-property-decorator'
import { Getter, Action } from 'pinia-class'
import { useStore } from '@/store/store'
import { AmalgamationMixin, DateMixin } from '@/mixins'
import {
  AmalgamationFilingIF, BusinessAddressIF, ContactPointIF, CertifyIF, CompletingPartyIF,
  CourtOrderIF, CourtOrderStepIF, CreateMemorandumIF, CreateResolutionIF, CreateRulesIF, DefineCompanyIF,
  DissolutionFilingIF, DissolutionStatementIF, DocumentDeliveryIF, EffectiveDateTimeIF, EmptyContactPoint,
  EmptyNaics, IncorporationAgreementIF, IncorporationFilingIF, NaicsIF, NameRequestFilingIF,
  NameTranslationIF, OfficeAddressIF, OrgPersonIF, PartyIF, PeopleAndRoleIF, RegisteredRecordsAddressesIF,
  RegistrationFilingIF, RegistrationStateIF, RestorationFilingIF, RestorationStateIF, ShareClassIF,
  ShareStructureIF, SpecialResolutionIF, StaffPaymentIF, StaffPaymentStepIF, UploadAffidavitIF
} from '@/interfaces'
import {
  AmalgamationTypes, ApprovalTypes, BusinessTypes, CoopTypes, CorrectNameOptions, DissolutionTypes,
  EffectOfOrders, FilingTypes, PartyTypes, RelationshipTypes, RestorationTypes, RoleTypes, StaffPaymentOptions
} from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

/**
 * Mixin that provides the integration with the Legal API.
 */
@Component({})
export default class FilingTemplateMixin extends Mixins(AmalgamationMixin, DateMixin) {
  @Getter(useStore) getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter(useStore) getAffidavitStep!: UploadAffidavitIF
  @Getter(useStore) getAmalgamationCourtApproval!: boolean
  @Getter(useStore) getAmalgamationType!: AmalgamationTypes
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getBusinessFoundingDate!: string
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getBusinessLegalName!: string
  @Getter(useStore) getBusinessLegalType!: CorpTypeCd
  @Getter(useStore) getBusinessOfficeAddress!: OfficeAddressIF
  @Getter(useStore) getBusinessStartDate!: string
  @Getter(useStore) getCertifyState!: CertifyIF
  @Getter(useStore) getCompletingParty!: CompletingPartyIF
  @Getter(useStore) getCorrectNameOption!: CorrectNameOptions
  @Getter(useStore) getCourtOrderStep!: CourtOrderStepIF
  @Getter(useStore) getCreateMemorandumStep!: CreateMemorandumIF
  @Getter(useStore) getCreateRulesStep!: CreateRulesIF
  @Getter(useStore) getCreateResolutionStep!: CreateResolutionIF
  @Getter(useStore) getCreateShareStructureStep!: ShareStructureIF
  // @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getDefineCompanyStep!: DefineCompanyIF
  @Getter(useStore) getDissolutionDate!: string
  @Getter(useStore) getDissolutionCustodian!: OrgPersonIF
  @Getter(useStore) getDissolutionStatementStep!: DissolutionStatementIF
  @Getter(useStore) getDissolutionType!: DissolutionTypes
  @Getter(useStore) getDocumentDelivery!: DocumentDeliveryIF
  @Getter(useStore) getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getFilingId!: number
  @Getter(useStore) getFolioNumber!: string
  @Getter(useStore) getIncorporationAgreementStep!: IncorporationAgreementIF
  @Getter(useStore) getMemorandum!: any
  @Getter(useStore) getNameRequestApprovedName!: string
  @Getter(useStore) getNameRequestNumber!: string
  @Getter(useStore) getNameTranslations!: NameTranslationIF[]
  @Getter(useStore) getRegistration!: RegistrationStateIF
  @Getter(useStore) getResolution!: any
  @Getter(useStore) getRestoration!: RestorationStateIF
  @Getter(useStore) getStaffPaymentStep!: StaffPaymentStepIF
  @Getter(useStore) getTempId!: string
  @Getter(useStore) getTransactionalFolioNumber!: string
  @Getter(useStore) isPremiumAccount!: boolean
  @Getter(useStore) isTypeCoop!: boolean
  @Getter(useStore) isTypeFirm!: boolean
  @Getter(useStore) isTypeSoleProp!: boolean

  @Action(useStore) setAffidavit!: (x: UploadAffidavitIF) => void
  @Action(useStore) setAmalgamationType!: (x: AmalgamationTypes) => void
  // @Action(useStore) setAmalgamatingBusinesses!: (x: Array<any>) => void
  @Action(useStore) setAmalgamationCourtApproval!: (x: boolean) => void
  @Action(useStore) setBusinessAddress!: (x: OfficeAddressIF) => void
  @Action(useStore) setBusinessContact!: (x: ContactPointIF) => void
  @Action(useStore) setCertifyState!: (x: CertifyIF) => void
  @Action(useStore) setCooperativeType!: (x: CoopTypes) => void
  @Action(useStore) setCorrectNameOption!: (x: CorrectNameOptions) => void
  @Action(useStore) setCourtOrderFileNumber!: (x: string) => void
  @Action(useStore) setCustodianOfRecords!: (x: OrgPersonIF) => void
  @Action(useStore) setDissolutionDate!: (x: string) => void
  @Action(useStore) setDissolutionStatementStepData!: (x: DissolutionStatementIF) => void
  @Action(useStore) setDissolutionType!: (x: DissolutionTypes) => void
  @Action(useStore) setDocumentOptionalEmail!: (x: string) => void
  @Action(useStore) setEffectiveDate!: (x: Date) => void
  @Action(useStore) setEntityType!: (x: CorpTypeCd) => void
  @Action(useStore) setFilingId!: (x: number) => void
  @Action(useStore) setFolioNumber!: (x: string) => void
  @Action(useStore) setIncorporationAgreementStepData!: (x: IncorporationAgreementIF) => void
  @Action(useStore) setHasPlanOfArrangement!: (x: boolean) => void
  @Action(useStore) setIsAutoPopulatedBusinessNumber!: (x: boolean) => void
  @Action(useStore) setIsFutureEffective!: (x: boolean) => void
  @Action(useStore) setFoundingDate!: (x: string) => void
  @Action(useStore) setLegalName!: (x: string) => void
  @Action(useStore) setMemorandum!: (x: CreateMemorandumIF) => void
  @Action(useStore) setNameRequestApprovedName!: (x: string) => void
  @Action(useStore) setNameTranslations!: (x: NameTranslationIF[]) => void
  @Action(useStore) setOfficeAddresses!: (x: RegisteredRecordsAddressesIF) => void
  @Action(useStore) setOrgPersonList!: (x: OrgPersonIF[]) => void
  @Action(useStore) setRegistrationBusinessAddress!: (x: BusinessAddressIF) => void
  @Action(useStore) setRegistrationBusinessNumber!: (x: string) => void
  @Action(useStore) setRegistrationBusinessType!: (x: BusinessTypes) => void
  @Action(useStore) setRegistrationBusinessTypeConfirm!: (x: boolean) => void
  @Action(useStore) setRegistrationFeeAcknowledgement!: (x: boolean) => void
  @Action(useStore) setRegistrationNaics!: (x: NaicsIF) => void
  @Action(useStore) setRegistrationStartDate!: (x: string) => void
  @Action(useStore) setResolution!: (x: CreateResolutionIF) => void
  @Action(useStore) setRestorationApplicationDate!: (x: string) => void
  @Action(useStore) setRestorationApprovalType!: (x: ApprovalTypes) => void
  @Action(useStore) setRestorationCourtOrder!: (x: CourtOrderIF) => void
  @Action(useStore) setRestorationExpiry!: (x: string) => void
  @Action(useStore) setRestorationNoticeDate!: (x: string) => void
  @Action(useStore) setRestorationRelationships!: (x: RelationshipTypes[]) => void
  @Action(useStore) setRestorationType!: (x: RestorationTypes) => void
  @Action(useStore) setRules!: (x: CreateRulesIF) => void
  @Action(useStore) setShareClasses!: (x: ShareClassIF[]) => void
  @Action(useStore) setStaffPayment!: (x: StaffPaymentIF) => void
  @Action(useStore) setBusinessStartDate!: (x: string) => void
  @Action(useStore) setTransactionalFolioNumber!: (x: string) => void

  /**
   * Builds an amalgamation application filing from store data. Used when saving a filing.
   * @returns the filing body to save
   */
  buildAmalgamationFiling (): AmalgamationFilingIF {
    function fixNullAddressType (orgPeople: OrgPersonIF[]): OrgPersonIF[] {
      return orgPeople.map(p => {
        if (p.deliveryAddress?.addressType === null) delete p.deliveryAddress.addressType
        if (p.mailingAddress?.addressType === null) delete p.mailingAddress.addressType
        return p
      })
    }

    // Build the main filing.
    const filing: AmalgamationFilingIF = {
      header: {
        name: FilingTypes.AMALGAMATION_APPLICATION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate,
        filingId: this.getFilingId,
        folioNumber: this.getFolioNumber,
        isFutureEffective: this.getEffectiveDateTime.isFutureEffective
      },
      business: {
        legalType: this.getEntityType,
        identifier: this.getTempId
      },
      amalgamationApplication: {
        amalgamatingBusinesses: this.getAmalgamatingBusinesses,
        type: this.getAmalgamationType,
        nameRequest: {
          legalType: this.getEntityType
        },
        nameTranslations: this.getNameTranslations,
        offices: this.getDefineCompanyStep.officeAddresses,
        contactPoint: {
          email: this.getBusinessContact.email,
          phone: this.getBusinessContact.phone,
          // don't save extension if it's empty
          ...this.getBusinessContact.extension
            ? { extension: +this.getBusinessContact.extension }
            : {}
        },
        courtApproval: this.getAmalgamationCourtApproval,
        parties: fixNullAddressType(this.getAddPeopleAndRoleStep.orgPeople)
      }
    }

    // Add share structure data.
    filing.amalgamationApplication.shareStructure = {
      shareClasses: this.getCreateShareStructureStep.shareClasses
    }

    // Add incorporation agreement data.
    filing.amalgamationApplication.incorporationAgreement = {
      agreementType: this.getIncorporationAgreementStep.agreementType
    }

    // Add court order / POA data.
    const courtOrder = this.getCourtOrderStep.courtOrder
    if (courtOrder && (courtOrder.hasPlanOfArrangement || courtOrder.fileNumber)) {
      filing.amalgamationApplication.courtOrder = {
        fileNumber: courtOrder.fileNumber,
        effectOfOrder: courtOrder.hasPlanOfArrangement ? EffectOfOrders.PLAN_OF_ARRANGEMENT : '',
        hasPlanOfArrangement: courtOrder.hasPlanOfArrangement
      }
    }

    // Add business name data.
    switch (this.getCorrectNameOption) {
      case CorrectNameOptions.CORRECT_AML_ADOPT:
        // save adopted name
        filing.amalgamationApplication.nameRequest.correctNameOption = CorrectNameOptions.CORRECT_AML_ADOPT
        filing.amalgamationApplication.nameRequest.legalName = this.getNameRequestApprovedName
        break
      case CorrectNameOptions.CORRECT_NEW_NR:
        // save NR data
        filing.amalgamationApplication.nameRequest.correctNameOption = CorrectNameOptions.CORRECT_NEW_NR
        filing.amalgamationApplication.nameRequest.legalName = this.getNameRequestApprovedName
        filing.amalgamationApplication.nameRequest.nrNumber = this.getNameRequestNumber
        break
      case CorrectNameOptions.CORRECT_AML_NUMBERED:
        // save numbered name
        filing.amalgamationApplication.nameRequest.correctNameOption = CorrectNameOptions.CORRECT_AML_NUMBERED
        filing.amalgamationApplication.nameRequest.legalName = this.getNameRequestApprovedName
        break
    }

    // If this is a future effective filing then save the effective date.
    if (this.getEffectiveDateTime.isFutureEffective) {
      filing.header.effectiveDate = this.dateToApi(this.getEffectiveDateTime.effectiveDate)
    }

    if (this.isRoleStaff) {
      // Add staff payment data.
      this.buildStaffPayment(filing)
    }
    return filing
  }

  /**
   * Parses a draft amalgamation application filing into the store. Used when loading a filing.
   * @param draftFiling the filing body to parse
   */
  parseAmalgamationDraft (draftFiling: any): void {
    // FUTURE: set types so each of these validate their parameters
    // ref: https://www.typescriptlang.org/docs/handbook/generics.html

    // NB: don't parse Name Request object -- NR is fetched from namex/NRO instead

    // save filing id
    this.setFilingId(+draftFiling.header.filingId)

    // restore Amalgamation Type
    this.setAmalgamationType(draftFiling.amalgamationApplication.type || AmalgamationTypes.REGULAR)

    // restore Entity Type
    this.setEntityType(draftFiling.amalgamationApplication.nameRequest.legalType)

    // restore the amalgamating businesses array
    if (draftFiling.amalgamationApplication.amalgamatingBusinesses) {
      this.setAmalgamatingBusinesses([
        // *** TODO: remove static items when they are no longer needed for testing
        // {
        //   type: AmlTypes.FOREIGN,
        //   corpNumber: 'XYZ789',
        //   legalName: 'Ice Cream Sandwich Canada',
        //   foreignJurisdiction: { region: 'FEDERAL', country: 'CA' },
        //   role: AmlRoles.AMALGAMATING
        // },
        // {
        //   type: AmlTypes.FOREIGN,
        //   corpNumber: 'ABC123',
        //   legalName: 'Gingerbread USA',
        //   foreignJurisdiction: { country: 'US' },
        //   role: AmlRoles.AMALGAMATING
        // },
        ...draftFiling.amalgamationApplication.amalgamatingBusinesses
      ])
      this.refetchAmalgamatingBusinessesInfo()
    }

    // restore the amalgamation court approval selection which the saved value is either true or false
    if (draftFiling.amalgamationApplication.courtApproval !== null) {
      this.setAmalgamationCourtApproval(draftFiling.amalgamationApplication.courtApproval)
    }

    // restore Office Addresses
    // *** TODO: verify whether we need to assign fallback
    // *** also fix IAs and registrations the same way?
    if (draftFiling.amalgamationApplication.offices) {
      this.setOfficeAddresses(draftFiling.amalgamationApplication.offices)
    }

    // restore business name data
    const nameRequest = draftFiling.amalgamationApplication.nameRequest as NameRequestFilingIF
    switch (nameRequest?.correctNameOption) {
      case CorrectNameOptions.CORRECT_AML_ADOPT:
        this.setCorrectNameOption(CorrectNameOptions.CORRECT_AML_ADOPT)
        // restore adopted name
        this.setNameRequestApprovedName(nameRequest.legalName)
        break
      case CorrectNameOptions.CORRECT_NEW_NR:
        this.setCorrectNameOption(CorrectNameOptions.CORRECT_NEW_NR)
        // NB: do not restore Name Request data
        // it will be reloaded from NR endpoint in App.vue
        break
      case CorrectNameOptions.CORRECT_AML_NUMBERED:
        this.setCorrectNameOption(CorrectNameOptions.CORRECT_AML_NUMBERED)
        // restore numbered name
        this.setNameRequestApprovedName(nameRequest.legalName)
        break
      default:
        // fallback for draft created without Correct Name Option
        // NB: do not restore Name Request data
        // it will be reloaded from NR endpoint in App.vue
        if (nameRequest.nrNumber) {
          this.setCorrectNameOption(CorrectNameOptions.CORRECT_NEW_NR)
        }
    }

    // restore Name Translations
    if (draftFiling.amalgamationApplication.nameTranslations) {
      this.setNameTranslations(draftFiling.amalgamationApplication.nameTranslations)
    }

    // restore Business Contact
    if (draftFiling.amalgamationApplication.contactPoint) {
      this.setBusinessContact({
        ...draftFiling.amalgamationApplication.contactPoint,
        confirmEmail: draftFiling.amalgamationApplication.contactPoint.email
      })
    } else {
      this.setBusinessContact({ ...EmptyContactPoint })
    }

    // restore Persons and Organizations
    if (draftFiling.amalgamationApplication.parties) {
      this.setOrgPersonList(draftFiling.amalgamationApplication.parties || [])
    }

    // restore Share Structure
    this.setShareClasses(draftFiling.amalgamationApplication.shareStructure
      ? draftFiling.amalgamationApplication.shareStructure.shareClasses
      : [])

    // restore Incorporation Agreement
    this.setIncorporationAgreementStepData({
      agreementType: draftFiling.amalgamationApplication.incorporationAgreement?.agreementType,
      valid: false
    })
    // set court order fields
    if (draftFiling.amalgamationApplication.courtOrder?.fileNumber) {
      this.setCourtOrderFileNumber(draftFiling.amalgamationApplication.courtOrder.fileNumber)
    }
    if (draftFiling.amalgamationApplication.courtOrder?.hasPlanOfArrangement) {
      this.setHasPlanOfArrangement(draftFiling.amalgamationApplication.courtOrder.hasPlanOfArrangement)
    }

    // restore Certify state
    this.setCertifyState({
      valid: false,
      certifiedBy: draftFiling.header.certifiedBy
    })

    // restore Future Effective data
    if (draftFiling.header.isFutureEffective) {
      this.setIsFutureEffective(true)
      const effectiveDate = this.apiToDate(draftFiling.header.effectiveDate)
      // Check that Effective Date is in the future, to improve UX and
      // to work around the default effective date set by the back end.
      if (effectiveDate >= this.getCurrentJsDate) this.setEffectiveDate(effectiveDate)
    }

    if (this.isRoleStaff) {
      // restore Staff Payment data
      this.parseStaffPayment(draftFiling)
    }

    // if this is a premium account and Folio Number exists then restore it
    if (this.isPremiumAccount) {
      if (draftFiling.header.folioNumber) {
        this.setFolioNumber(draftFiling.header.folioNumber)
      }
    }
  }

  /**
   * Builds an incorporation application filing from store data. Used when saving a filing.
   * @returns the filing body to save
   */
  buildIncorporationFiling (): IncorporationFilingIF {
    function fixNullAddressType (orgPeople: OrgPersonIF[]): OrgPersonIF[] {
      return orgPeople.map(p => {
        if (p.deliveryAddress?.addressType === null) delete p.deliveryAddress.addressType
        if (p.mailingAddress?.addressType === null) delete p.mailingAddress.addressType
        return p
      })
    }

    // Build the main filing.
    const filing: IncorporationFilingIF = {
      header: {
        name: FilingTypes.INCORPORATION_APPLICATION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate,
        filingId: this.getFilingId,
        folioNumber: this.getFolioNumber,
        isFutureEffective: this.getEffectiveDateTime.isFutureEffective
      },
      business: {
        legalType: this.getEntityType,
        identifier: this.getTempId
      },
      incorporationApplication: {
        nameRequest: {
          legalType: this.getEntityType
        },
        nameTranslations: this.getNameTranslations,
        offices: this.getDefineCompanyStep.officeAddresses,
        contactPoint: {
          email: this.getBusinessContact.email,
          phone: this.getBusinessContact.phone,
          // don't save extension if it's empty
          ...this.getBusinessContact.extension
            ? { extension: +this.getBusinessContact.extension }
            : {}
        },
        parties: fixNullAddressType(this.getAddPeopleAndRoleStep.orgPeople)
      }
    }

    // Conditionally add the entity-specific sections.
    switch (this.getEntityType) {
      case CorpTypeCd.COOP:
        filing.incorporationApplication.cooperative = {
          cooperativeAssociationType: this.getDefineCompanyStep.cooperativeType,
          rulesFileKey: this.getCreateRulesStep.docKey || null,
          rulesFileName: this.getCreateRulesStep.rulesFile?.name || null,
          rulesFileSize: this.getCreateRulesStep.rulesFile?.size || null,
          rulesFileLastModified: this.getCreateRulesStep.rulesFile?.lastModified || null,
          rulesConfirmed: this.getCreateRulesStep.rulesConfirmed || false,
          memorandumFileKey: this.getCreateMemorandumStep.docKey || null,
          memorandumFileName: this.getCreateMemorandumStep?.memorandumFile?.name || null,
          memorandumFileSize: this.getCreateMemorandumStep?.memorandumFile?.size || null,
          memorandumFileLastModified: this.getCreateMemorandumStep?.memorandumFile?.lastModified || null,
          memorandumConfirmed: this.getCreateMemorandumStep.memorandumConfirmed || false
        }
        break
      case CorpTypeCd.BENEFIT_COMPANY:
      case CorpTypeCd.BC_CCC:
      case CorpTypeCd.BC_COMPANY:
      case CorpTypeCd.BC_ULC_COMPANY: {
        filing.incorporationApplication.shareStructure = {
          shareClasses: this.getCreateShareStructureStep.shareClasses
        }
        filing.incorporationApplication.incorporationAgreement = {
          agreementType: this.getIncorporationAgreementStep.agreementType
        }

        const courtOrder = this.getCourtOrderStep.courtOrder
        if (courtOrder && (courtOrder.hasPlanOfArrangement || courtOrder.fileNumber)) {
          filing.incorporationApplication.courtOrder = {
            fileNumber: courtOrder.fileNumber,
            effectOfOrder: courtOrder.hasPlanOfArrangement ? EffectOfOrders.PLAN_OF_ARRANGEMENT : '',
            hasPlanOfArrangement: courtOrder.hasPlanOfArrangement
          }
        }
        break
      }
    }

    // If this is a named IA then add Name Request Number and Approved Name.
    if (this.getNameRequestNumber) {
      filing.incorporationApplication.nameRequest.nrNumber = this.getNameRequestNumber
      filing.incorporationApplication.nameRequest.legalName = this.getNameRequestApprovedName
    }

    // If this is a future effective filing then save the effective date.
    if (this.getEffectiveDateTime.isFutureEffective) {
      filing.header.effectiveDate = this.dateToApi(this.getEffectiveDateTime.effectiveDate)
    }

    if (this.isRoleStaff) {
      // Add staff payment data.
      this.buildStaffPayment(filing)
    }
    return filing
  }

  /**
   * Parses a draft incorporation application  filing into the store. Used when loading a filing.
   * @param draftFiling the filing body to parse
   */
  parseIncorporationDraft (draftFiling: any): void {
    // FUTURE: set types so each of these validate their parameters
    // ref: https://www.typescriptlang.org/docs/handbook/generics.html

    // NB: don't parse Name Request object -- NR is fetched from namex/NRO instead

    // save filing id
    this.setFilingId(+draftFiling.header.filingId)

    // restore Entity Type
    this.setEntityType(draftFiling.incorporationApplication.nameRequest.legalType)

    // restore Office Addresses
    this.setOfficeAddresses(draftFiling.incorporationApplication.offices)

    // restore Name Translations
    if (draftFiling.incorporationApplication.nameTranslations) {
      this.setNameTranslations(draftFiling.incorporationApplication.nameTranslations)
    }

    // restore Business Contact
    this.setBusinessContact({
      ...draftFiling.incorporationApplication.contactPoint,
      confirmEmail: draftFiling.incorporationApplication.contactPoint.email
    })

    // restore Persons and Organizations
    if (draftFiling.incorporationApplication.parties) {
      this.setOrgPersonList(draftFiling.incorporationApplication.parties)
    }

    // conditionally restore the entity-specific sections
    switch (this.getEntityType) {
      case CorpTypeCd.COOP: {
        // restore Cooperative type
        this.setCooperativeType(draftFiling.incorporationApplication.cooperative?.cooperativeAssociationType)

        // restore Rules
        let rulesFile = null as File
        if (draftFiling.incorporationApplication.cooperative?.rulesFileKey) {
          rulesFile = {
            name: draftFiling.incorporationApplication.cooperative?.rulesFileName,
            lastModified: draftFiling.incorporationApplication.cooperative?.rulesFileLastModified,
            size: draftFiling.incorporationApplication.cooperative?.rulesFileSize
          } as File
        }
        const createRules: CreateRulesIF = {
          validationDetail: {
            valid: false,
            validationItemDetails: []
          },
          rulesConfirmed: draftFiling.incorporationApplication.cooperative?.rulesConfirmed,
          rulesFile,
          docKey: draftFiling.incorporationApplication.cooperative?.rulesFileKey
        }
        this.setRules(createRules)

        // restore Memorandum
        let memorandumFile = null as File
        if (draftFiling.incorporationApplication.cooperative?.memorandumFileKey) {
          memorandumFile = {
            name: draftFiling.incorporationApplication.cooperative?.memorandumFileName,
            lastModified: draftFiling.incorporationApplication.cooperative?.memorandumFileLastModified,
            size: draftFiling.incorporationApplication.cooperative?.memorandumFileSize
          } as File
        }
        const createMemorandum: CreateMemorandumIF = {
          validationDetail: {
            valid: false,
            validationItemDetails: []
          },
          memorandumConfirmed: draftFiling.incorporationApplication.cooperative?.memorandumConfirmed,
          memorandumFile,
          docKey: draftFiling.incorporationApplication.cooperative?.memorandumFileKey
        }
        this.setMemorandum(createMemorandum)

        break
      }
      case CorpTypeCd.BENEFIT_COMPANY:
      case CorpTypeCd.BC_CCC:
      case CorpTypeCd.BC_COMPANY:
      case CorpTypeCd.BC_ULC_COMPANY:
        // restore Share Structure
        this.setShareClasses(draftFiling.incorporationApplication.shareStructure
          ? draftFiling.incorporationApplication.shareStructure.shareClasses
          : [])

        // restore Incorporation Agreement
        this.setIncorporationAgreementStepData({
          agreementType: draftFiling.incorporationApplication.incorporationAgreement?.agreementType,
          valid: false
        })
        // set court order fields
        if (draftFiling.incorporationApplication.courtOrder?.fileNumber) {
          this.setCourtOrderFileNumber(draftFiling.incorporationApplication.courtOrder.fileNumber)
        }
        if (draftFiling.incorporationApplication.courtOrder?.hasPlanOfArrangement) {
          this.setHasPlanOfArrangement(draftFiling.incorporationApplication.courtOrder.hasPlanOfArrangement)
        }
        break
    }

    // restore Certify state
    this.setCertifyState({
      valid: false,
      certifiedBy: draftFiling.header.certifiedBy
    })

    // restore Future Effective data
    if (draftFiling.header.isFutureEffective) {
      this.setIsFutureEffective(true)
      const effectiveDate = this.apiToDate(draftFiling.header.effectiveDate)
      // Check that Effective Date is in the future, to improve UX and
      // to work around the default effective date set by the back end.
      if (effectiveDate >= this.getCurrentJsDate) this.setEffectiveDate(effectiveDate)
    }

    if (this.isRoleStaff) {
      // restore Staff Payment data
      this.parseStaffPayment(draftFiling)
    }

    // if this is a premium account and Folio Number exists then restore it
    if (this.isPremiumAccount) {
      if (draftFiling.header.folioNumber) {
        this.setFolioNumber(draftFiling.header.folioNumber)
      }
    }
  }

  /**
   * Builds a registration filing from store data. Used when saving a filing.
   * @returns the filing body to save
   */
  buildRegistrationFiling (): any {
    // Build the main filing.
    const filing: RegistrationFilingIF = {
      header: {
        name: FilingTypes.REGISTRATION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate,
        filingId: this.getFilingId,
        folioNumber: this.getFolioNumber, // default FN; may be overwritten by staff BCOL FN
        isFutureEffective: false
      },
      registration: {
        business: {
          identifier: this.getTempId,
          naics: this.getRegistration.naics,
          taxId: this.getRegistration.businessNumber || undefined // can't be null
        },
        offices: {
          businessOffice: this.getRegistration.businessAddress
        },
        businessType: this.getRegistration.businessType,
        contactPoint: {
          email: this.getBusinessContact.email,
          phone: this.getBusinessContact.phone,
          // don't save extension if it's empty
          ...this.getBusinessContact.extension
            ? { extension: +this.getBusinessContact.extension }
            : {}
        },
        nameRequest: {
          legalName: this.getNameRequestApprovedName,
          legalType: this.getEntityType,
          nrNumber: this.getNameRequestNumber
        },
        parties: this.orgPersonsToParties(this.getAddPeopleAndRoleStep.orgPeople),
        startDate: this.getRegistration.startDate,
        businessTypeConfirm: this.getRegistration.businessTypeConfirm,

        isAutoPopulatedBusinessNumber: this.getRegistration.isAutoPopulatedBusinessNumber
      }
    }

    if (this.isRoleStaff) {
      // Add staff payment data.
      this.buildStaffPayment(filing)
    }

    // NB: Premium account is mutually exclusive with staff role.
    if (this.isPremiumAccount) {
      this.buildFolioNumber(filing)
    }

    return filing
  }

  /**
   * Builds a restoration filing from store data. Used when saving a filing.
   * @returns the filing body to save
   */
  buildRestorationFiling (): any {
    // Build the main filing.
    const filing: RestorationFilingIF = {
      header: {
        name: FilingTypes.RESTORATION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate,
        filingId: this.getFilingId,
        folioNumber: this.getFolioNumber, // default FN; may be overwritten by staff BCOL FN
        isFutureEffective: false
      },
      business: {
        legalType: this.getEntityType,
        identifier: this.getBusinessId,
        foundingDate: this.getBusinessFoundingDate
      },
      restoration: {
        applicationDate: this.getRestoration.applicationDate || undefined, // can't be null
        approvalType: this.getRestoration.approvalType,
        contactPoint: {
          email: this.getBusinessContact.email,
          phone: this.getBusinessContact.phone,
          // don't save extension if it's empty
          ...this.getBusinessContact.extension
            ? { extension: +this.getBusinessContact.extension }
            : {}
        },
        expiry: this.getRestoration.expiry || undefined, // can't be null
        nameRequest: {
          legalType: this.getEntityType
        },
        nameTranslations: this.getNameTranslations,
        noticeDate: this.getRestoration.noticeDate || undefined, // can't be null
        offices: this.getDefineCompanyStep.officeAddresses,
        parties: this.orgPersonsToParties(this.getAddPeopleAndRoleStep.orgPeople),
        relationships: this.getRestoration.relationships,
        type: this.getRestoration.type
      }
    }

    // Add court order data.
    const fileNumber = this.getRestoration.courtOrder.fileNumber
    if (fileNumber) filing.restoration.courtOrder = { fileNumber }

    // Add business name data.
    switch (this.getCorrectNameOption) {
      case CorrectNameOptions.CORRECT_NAME:
        // not applicable to restoration
        break
      case CorrectNameOptions.CORRECT_NAME_TO_NUMBER:
        filing.restoration.nameRequest.correctNameOption = CorrectNameOptions.CORRECT_NAME_TO_NUMBER
        filing.restoration.nameRequest.legalName = this.getNameRequestApprovedName
        break
      case CorrectNameOptions.CORRECT_NEW_NR:
        filing.restoration.nameRequest.correctNameOption = CorrectNameOptions.CORRECT_NEW_NR
        filing.restoration.nameRequest.legalName = this.getNameRequestApprovedName
        filing.restoration.nameRequest.nrNumber = this.getNameRequestNumber
        break
    }

    if (this.isRoleStaff) {
      // Add staff payment data.
      this.buildStaffPayment(filing)
    }

    // NB: Premium account is mutually exclusive with staff role.
    if (this.isPremiumAccount) {
      this.buildFolioNumber(filing)
    }

    return filing
  }

  private orgPersonsToParties (orgPersons: OrgPersonIF[]): PartyIF[] {
    return orgPersons.map(orgPerson => {
      // convert businessNumber -> taxId
      const party = {
        ...orgPerson,
        officer: {
          ...orgPerson.officer,
          taxId: orgPerson.officer.businessNumber
        }
      }
      delete party.officer.businessNumber

      // if tax id is empty (which doesn't match the schema pattern), delete it
      if (!party.officer.taxId) delete party.officer.taxId

      return party as PartyIF
    })
  }

  /**
   * Parses a draft registration filing into the store. Used when loading a filing.
   * @param draftFiling the filing body to parse
   */
  parseRegistrationDraft (draftFiling: any): void {
    // NB: don't parse Name Request object -- NR is fetched from namex/NRO instead

    // save filing id
    this.setFilingId(+draftFiling.header.filingId)

    // restore Business Address
    this.setRegistrationBusinessAddress(draftFiling.registration.offices?.businessOffice)

    // restore Business Type
    this.setRegistrationBusinessType(draftFiling.registration.businessType)

    // restore Business Contact
    this.setBusinessContact({
      ...draftFiling.registration.contactPoint,
      confirmEmail: draftFiling.registration.contactPoint.email
    })

    // restore NAICS
    this.setRegistrationNaics(draftFiling.registration.business?.naics || EmptyNaics)

    // restore Business Number
    this.setRegistrationBusinessNumber(draftFiling.registration.business?.taxId || null)
    this.setIsAutoPopulatedBusinessNumber(draftFiling.registration.isAutoPopulatedBusinessNumber || false)

    // restore Business Type Confirm
    this.setRegistrationBusinessTypeConfirm(draftFiling.registration.businessTypeConfirm || false)

    // NB: do not restore Name Request data
    // it will be reloaded from NR endpoint in App.vue

    // restore Entity Type
    this.setEntityType(draftFiling.registration.nameRequest.legalType)

    // restore start date
    this.setRegistrationStartDate(draftFiling.registration.startDate)

    // restore Persons and Organizations
    this.setOrgPersonList(this.partiesToOrgPersons(draftFiling.registration.parties || []))

    // restore Certify state
    this.setCertifyState({
      valid: false,
      certifiedBy: draftFiling.header.certifiedBy
    })

    // do not restore Fee Acknowledgement
    this.setRegistrationFeeAcknowledgement(false)

    // NB: Staff role is mutually exclusive with premium account.
    if (this.isRoleStaff) {
      // restore Staff Payment data
      this.parseStaffPayment(draftFiling)
    }

    // if this is a premium account and Transactional Folio Number exists then restore it
    // NB: Premium account is mutually exclusive with staff role.
    if (this.isPremiumAccount) {
      // if Transactional Folio Number exists then restore it
      if (draftFiling.header.isTransactionalFolioNumber && draftFiling.header.folioNumber) {
        this.setTransactionalFolioNumber(draftFiling.header.folioNumber)
      }
    }
  }

  /**
   * Parses a draft restoration filing into the store. Used when loading a filing.
   * @param draftFiling the filing body to parse
   */
  parseRestorationDraft (draftFiling: any): void {
    // NB: don't parse Name Request object -- NR is fetched from namex/NRO instead

    // save filing id
    this.setFilingId(+draftFiling.header.filingId)

    // restore Business data
    this.setEntityType(draftFiling.business.legalType || this.getBusinessLegalType)
    this.setLegalName(null) // don't show original legal name since it's no longer valid
    this.setFoundingDate(draftFiling.business.foundingDate || this.getBusinessFoundingDate)

    // restore Restoration data
    if (draftFiling.restoration.applicationDate) {
      this.setRestorationApplicationDate(draftFiling.restoration.applicationDate)
    }
    this.setRestorationApprovalType(draftFiling.restoration.approvalType)
    if (draftFiling.restoration.courtOrder) {
      this.setRestorationCourtOrder(draftFiling.restoration.courtOrder)
    }
    this.setRestorationType(draftFiling.restoration.type)
    if (draftFiling.restoration.expiry) {
      this.setRestorationExpiry(draftFiling.restoration.expiry)
    }
    if (draftFiling.restoration.relationships) {
      this.setRestorationRelationships(draftFiling.restoration.relationships)
    }
    if (draftFiling.restoration.noticeDate) {
      this.setRestorationNoticeDate(draftFiling.restoration.noticeDate)
    }
    if (draftFiling.restoration.applicationDate) {
      this.setRestorationApplicationDate(draftFiling.restoration.applicationDate)
    }

    // restore business name data
    const nameRequest = draftFiling.restoration.nameRequest as NameRequestFilingIF
    switch (nameRequest?.correctNameOption) {
      case CorrectNameOptions.CORRECT_NAME:
        // not applicable to restoration
        break
      case CorrectNameOptions.CORRECT_NAME_TO_NUMBER:
        this.setCorrectNameOption(CorrectNameOptions.CORRECT_NAME_TO_NUMBER)
        // restore numbered name
        this.setNameRequestApprovedName(nameRequest.legalName)
        break
      case CorrectNameOptions.CORRECT_NEW_NR:
        this.setCorrectNameOption(CorrectNameOptions.CORRECT_NEW_NR)
        // NB: do not restore Name Request data
        // it will be reloaded from NR endpoint in App.vue
        break
    }

    // restore Name Translations
    if (draftFiling.restoration.nameTranslations) {
      this.setNameTranslations(draftFiling.restoration.nameTranslations)
    }

    // restore Persons and Organizations
    if (draftFiling.restoration.parties) {
      this.setOrgPersonList(this.partiesToOrgPersons(draftFiling.restoration.parties))
    }

    // restore Office addresses
    if (draftFiling.restoration.offices) {
      this.setOfficeAddresses(draftFiling.restoration.offices)
    }

    // restore Business Contact
    if (draftFiling.restoration.contactPoint) {
      this.setBusinessContact({
        ...draftFiling.restoration.contactPoint,
        confirmEmail: draftFiling.restoration.contactPoint?.email
      })
    }

    // restore Certify state
    this.setCertifyState({
      valid: false,
      certifiedBy: draftFiling.header.certifiedBy
    })

    // NB: Staff role is mutually exclusive with premium account.
    if (this.isRoleStaff) {
      // restore Staff Payment data
      this.parseStaffPayment(draftFiling)
    }

    // if this is a premium account and Transactional Folio Number exists then restore it
    // NB: Premium account is mutually exclusive with staff role.
    if (this.isPremiumAccount) {
      // if Transactional Folio Number exists then restore it
      if (draftFiling.header.isTransactionalFolioNumber && draftFiling.header.folioNumber) {
        this.setTransactionalFolioNumber(draftFiling.header.folioNumber)
      }
    }
  }

  private partiesToOrgPersons (parties: PartyIF[]): OrgPersonIF[] {
    return parties.map(party => {
      // convert taxId -> businessNumber
      const orgPerson = {
        ...party,
        officer: {
          ...party.officer,
          businessNumber: party.officer.taxId
        }
      }
      delete orgPerson.officer.taxId
      return orgPerson as OrgPersonIF
    })
  }

  /**
   * Builds a dissolution filing from store data. Used when saving a filing.
   * @returns the filing body to save
   */
  buildDissolutionFiling (): DissolutionFilingIF {
    // Build the main filing.
    const filing: DissolutionFilingIF = {
      header: {
        name: FilingTypes.DISSOLUTION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate,
        filingId: this.getFilingId,
        folioNumber: this.getFolioNumber, // default FN; may be overwritten by Transactional FN or staff BCOL FN
        isFutureEffective: false
      },
      business: {
        legalType: this.getEntityType,
        identifier: this.getBusinessId,
        legalName: this.getBusinessLegalName,
        foundingDate: this.getBusinessFoundingDate,
        startDate: this.getBusinessStartDate
      },
      dissolution: {
        dissolutionDate: this.getCurrentDate,
        affidavitConfirmed: this.getAffidavitStep.validationDetail.validationItemDetails[0]?.valid || false,
        custodialOffice: this.getBusinessOfficeAddress,
        dissolutionType: this.getDissolutionType,
        parties: [{
          ...this.getDissolutionCustodian,
          roles: [
            {
              roleType: RoleTypes.CUSTODIAN,
              appointmentDate: this.getCurrentDate
            }
          ]
        }]
      }
    }

    // Conditionally add the entity-specific sections.
    switch (this.getEntityType) {
      case CorpTypeCd.COOP:
        filing.dissolution = {
          ...filing.dissolution,
          dissolutionStatementType: this.getDissolutionStatementStep.dissolutionStatementType || null,
          affidavitFileKey: this.getAffidavitStep.docKey || null,
          affidavitFileName: this.getAffidavitStep.affidavitFile?.name || null,
          affidavitFileSize: this.getAffidavitStep.affidavitFile?.size || null,
          affidavitFileLastModified: this.getAffidavitStep.affidavitFile?.lastModified || null
        }
        filing.specialResolution = {
          ...filing.specialResolution,
          resolutionConfirmed: this.getCreateResolutionStep.resolutionConfirmed || false,
          resolutionDate: this.getCreateResolutionStep.resolutionDate,
          resolution: this.getCreateResolutionStep.resolutionText,
          signatory: this.getCreateResolutionStep.signingPerson,
          signingDate: this.getCreateResolutionStep.signingDate
        } as SpecialResolutionIF
        break
      case CorpTypeCd.BENEFIT_COMPANY:
      case CorpTypeCd.BC_CCC:
      case CorpTypeCd.BC_COMPANY:
      case CorpTypeCd.BC_ULC_COMPANY:
        filing.dissolution = {
          ...filing.dissolution,
          resolution: {
            resolutionConfirmed: this.getCreateResolutionStep.resolutionConfirmed || false
          }
        }
        break
      case CorpTypeCd.SOLE_PROP:
      case CorpTypeCd.PARTNERSHIP:
        filing.dissolution = {
          ...filing.dissolution,
          dissolutionDate: this.getDissolutionDate,
          parties: [{
            officer: {
              partyType: PartyTypes.PERSON,
              firstName: this.getCompletingParty?.firstName,
              middleName: this.getCompletingParty?.middleName,
              lastName: this.getCompletingParty?.lastName
            },
            mailingAddress: this.getCompletingParty?.mailingAddress,
            roles: [
              {
                roleType: RoleTypes.COMPLETING_PARTY,
                appointmentDate: this.getCurrentDate
              }
            ]
          }]
        }
    }

    // If this is a future effective filing then save the effective date (all except Coop).
    if (this.getEffectiveDateTime.isFutureEffective === true) filing.header.isFutureEffective = true
    if (this.getEffectiveDateTime.isFutureEffective === false) filing.header.isFutureEffective = false
    if (this.getEffectiveDateTime.isFutureEffective && !this.isTypeCoop) {
      filing.header.effectiveDate = this.dateToApi(this.getEffectiveDateTime.effectiveDate)
    }

    // Add Court Order ONLY when it is required and applied.
    const courtOrder = this.getCourtOrderStep.courtOrder
    if (courtOrder.hasPlanOfArrangement || courtOrder.fileNumber) {
      filing.dissolution.courtOrder = {
        fileNumber: courtOrder.fileNumber,
        effectOfOrder: courtOrder.hasPlanOfArrangement ? EffectOfOrders.PLAN_OF_ARRANGEMENT : '',
        hasPlanOfArrangement: courtOrder.hasPlanOfArrangement
      }
    }

    // NB: Staff role is mutually exclusive with premium account.
    if (this.isRoleStaff) {
      if (this.getDocumentDelivery.documentOptionalEmail) {
        filing.header.documentOptionalEmail = this.getDocumentDelivery.documentOptionalEmail
      }

      // Add staff payment data.
      this.buildStaffPayment(filing)
    }

    // NB: Premium account is mutually exclusive with staff role.
    if (this.isPremiumAccount) {
      this.buildFolioNumber(filing)
    }

    return filing
  }

  /**
   * Parses a draft dissolution filing into the store. Used when loading a filing.
   * @param draftFiling the filing body to parse
   */
  parseDissolutionDraft (draftFiling: any): void {
    // save filing id
    this.setFilingId(+draftFiling.header.filingId)

    // restore Business data
    this.setEntityType(draftFiling.business.legalType || this.getBusinessLegalType)
    this.setLegalName(draftFiling.business.legalName || this.getBusinessLegalName)
    this.setFoundingDate(draftFiling.business.foundingDate || this.getBusinessFoundingDate)
    this.setBusinessStartDate(draftFiling.business.startDate || this.getBusinessStartDate)

    // restore Dissolution data
    this.setBusinessAddress(draftFiling.dissolution.custodialOffice)
    this.setDissolutionType(draftFiling.dissolution.dissolutionType)

    // dissolution statement only exists for COOPS
    // for others this will be null/undefined but it isn't used anyway
    this.setDissolutionStatementStepData({
      valid: !!draftFiling.dissolution?.dissolutionStatementType,
      dissolutionStatementType: draftFiling.dissolution?.dissolutionStatementType
    })

    // take the first party, as there is only a single custodian in a dissolution filing
    if (draftFiling.dissolution.parties) {
      this.setCustodianOfRecords(draftFiling.dissolution.parties[0])
    }

    // restore Resolution data
    const createResolution: CreateResolutionIF = {
      validationDetail: {
        valid: false,
        validationItemDetails: []
      },
      resolutionConfirmed:
        draftFiling.specialResolution?.resolutionConfirmed ||
        draftFiling.dissolution?.resolution?.resolutionConfirmed || false,
      // special resolution specific fields
      resolutionDate: draftFiling.specialResolution?.resolutionDate,
      resolutionText: draftFiling.specialResolution?.resolution,
      signingPerson: draftFiling.specialResolution?.signatory,
      signingDate: draftFiling.specialResolution?.signingDate
    }
    this.setResolution(createResolution)

    // ** do not restore Future Effective data per PO decision
    // ** leave code in case we need it later
    // // restore Future Effective data
    // if (draftFiling.header.isFutureEffective === true) this.setIsFutureEffective(true)
    // if (draftFiling.header.isFutureEffective === false) this.setIsFutureEffective(false)
    // if (draftFiling.header.isFutureEffective && !this.isTypeCoop) {
    //   const effectiveDate = this.apiToDate(draftFiling.header.effectiveDate)
    //   // Check that Effective Date is in the future, to improve UX and
    //   // to work around the default effective date set by the back end.
    //   if (effectiveDate >= this.getCurrentJsDate) this.setEffectiveDate(effectiveDate)
    // }

    // restore Affidavit
    let affidavitFile = null as File
    if (draftFiling.dissolution?.affidavitFileKey) {
      affidavitFile = {
        name: draftFiling.dissolution.affidavitFileName,
        lastModified: draftFiling.dissolution.affidavitFileLastModified,
        size: draftFiling.dissolution.affidavitFileSize
      } as File
    }
    const uploadAffidavit: UploadAffidavitIF = {
      validationDetail: {
        valid: false,
        validationItemDetails: []
      },
      affidavitConfirmed: draftFiling.dissolution?.affidavitConfirmed,
      affidavitFile,
      docKey: draftFiling.dissolution?.affidavitFileKey
    }
    this.setAffidavit(uploadAffidavit)

    // restore Court Order data
    this.setCourtOrderFileNumber(draftFiling.dissolution.courtOrder?.fileNumber || '')
    this.setHasPlanOfArrangement(draftFiling.dissolution.courtOrder?.hasPlanOfArrangement || false)

    // NB: do not restore/overwrite Folio Number - just use the FN from auth info (see App.vue)

    // NB: Staff role is mutually exclusive with premium account.
    if (this.isRoleStaff) {
      // restore document optional email
      this.setDocumentOptionalEmail(draftFiling.header.documentOptionalEmail)

      // restore Staff Payment data
      this.parseStaffPayment(draftFiling)
    }

    // NB: Premium account is mutually exclusive with staff role.
    if (this.isPremiumAccount) {
      // if Transactional Folio Number exists then restore it
      if (draftFiling.header.isTransactionalFolioNumber && draftFiling.header.folioNumber) {
        this.setTransactionalFolioNumber(draftFiling.header.folioNumber)
      }
    }

    // set dissolution date for SP and GP if saved as draft
    if (this.isTypeFirm) {
      this.setDissolutionDate(draftFiling.dissolution.dissolutionDate)
    }
  }

  /**
   * Builds dissolution staff payment data from store data.
   * @param filing the filing body to update
   */
  // eslint-disable-next-line max-len
  private buildStaffPayment (filing: AmalgamationFilingIF | DissolutionFilingIF | RegistrationFilingIF | RestorationFilingIF | IncorporationFilingIF): void {
    // Populate Staff Payment according to payment option
    const staffPayment = this.getStaffPaymentStep.staffPayment
    switch (staffPayment.option) {
      case StaffPaymentOptions.FAS:
        filing.header.routingSlipNumber = staffPayment.routingSlipNumber
        filing.header.priority = staffPayment.isPriority
        break

      case StaffPaymentOptions.BCOL:
        filing.header.bcolAccountNumber = staffPayment.bcolAccountNumber
        filing.header.datNumber = staffPayment.datNumber
        // override Folio Number if BCOL FN exists
        if (staffPayment.folioNumber) filing.header.folioNumber = staffPayment.folioNumber
        filing.header.priority = staffPayment.isPriority
        break

      case StaffPaymentOptions.NO_FEE:
        filing.header.waiveFees = true
        filing.header.priority = false
        break

      case StaffPaymentOptions.NONE: // should never happen
        break
    }
  }

  /**
   * If a Transactional Folio number was entered then override the Folio number
   * @param filing the filing body to update
   */
  private buildFolioNumber (filing: DissolutionFilingIF | RegistrationFilingIF | RestorationFilingIF): void {
    // override Folio Number if TFN exists and is different than default FN
    // also save a flag to correctly restore a draft later
    const fn = this.getFolioNumber
    const tfn = this.getTransactionalFolioNumber
    if (tfn && tfn !== fn) {
      filing.header.folioNumber = tfn
      filing.header.isTransactionalFolioNumber = true
    }
  }

  /**
   * Parses dissolution staff payment data into the store.
   * @param filing the filing body to parse
   */
  // eslint-disable-next-line max-len
  private parseStaffPayment (filing: AmalgamationFilingIF | DissolutionFilingIF | RegistrationFilingIF | RestorationFilingIF | IncorporationFilingIF): void {
    // Parse staff payment
    if (filing.header.routingSlipNumber) {
      this.setStaffPayment({
        option: StaffPaymentOptions.FAS,
        routingSlipNumber: filing.header.routingSlipNumber,
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: filing.header.priority
      })
    } else if (filing.header.bcolAccountNumber) {
      this.setStaffPayment({
        option: StaffPaymentOptions.BCOL,
        routingSlipNumber: '',
        bcolAccountNumber: filing.header.bcolAccountNumber,
        datNumber: filing.header.datNumber,
        folioNumber: filing.header.folioNumber,
        isPriority: filing.header.priority
      })
    } else if (filing.header.waiveFees) {
      this.setStaffPayment({
        option: StaffPaymentOptions.NO_FEE,
        routingSlipNumber: '',
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: false
      })
    } else {
      this.setStaffPayment({
        option: StaffPaymentOptions.NONE,
        routingSlipNumber: '',
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: false
      })
    }
  }

  /**
   * Ensure consistent object structure for an Incorporation Application, whether it contains
   * a Name Request or not, and whether it is an initial * draft or it has been previously
   * saved. Object merging does not work very well otherwise due to nested properties.
   * @param filing the filing fetched from legal-api
   * @returns the filing in safe-empty state if applicable
   */
  formatEmptyIncorporationApplication (filing: any): IncorporationFilingIF {
    const toReturn = filing
    if (toReturn.incorporationApplication) {
      // set offices
      if (!toReturn.incorporationApplication?.offices) {
        toReturn.incorporationApplication.offices = []
      }
      // set contact point
      if (!toReturn.incorporationApplication?.contactPoint) {
        toReturn.incorporationApplication.contactPoint = {
          email: '',
          phone: ''
        }
      }
      // set parties
      if (!toReturn.incorporationApplication?.parties) {
        toReturn.incorporationApplication.parties = []
      }
      // set share classes
      if (!toReturn.incorporationApplication?.shareClasses) {
        toReturn.incorporationApplication.shareClasses = []
      }
    }
    return toReturn
  }

  /**
   * Ensure consistent object structure for a Registration, whether it contains a Name
   * Request or not, and whether it is an initial draft or it has been previously saved.
   * Object merging does not work very well otherwise due to nested properties.
   * @param filing the filing fetched from legal-api
   * @returns the filing in safe-empty state if applicable
   */
  formatEmptyRegistration (filing: any): RegistrationFilingIF {
    const toReturn = filing
    if (toReturn.registration) {
      // set offices
      if (!toReturn.registration?.offices) {
        toReturn.registration.offices = {}
      }
      // set contact point
      if (!toReturn.registration?.contactPoint) {
        toReturn.registration.contactPoint = {
          email: '',
          phone: ''
        }
      }
      // set parties
      if (!toReturn.registration?.parties) {
        toReturn.registration.parties = []
      }
    }
    return toReturn
  }
}
