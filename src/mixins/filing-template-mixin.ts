import { Component } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { DateMixin } from '@/mixins'
import { ActionBindingIF, BusinessIF, ContactPointIF, CertifyIF, CompletingPartyIF, CourtOrderStepIF,
  CreateMemorandumIF, CreateResolutionIF, CreateRulesIF, DefineCompanyIF, DissolutionFilingIF,
  DissolutionStatementIF, DocIF, DocumentDeliveryIF, EffectiveDateTimeIF, EmptyNaics,
  IncorporationAgreementIF, IncorporationFilingIF, NameTranslationIF, OrgPersonIF, PartyIF,
  PeopleAndRoleIF, RegistrationFilingIF, RegistrationStateIF, RestorationFilingIF, RestorationStateIF,
  ShareStructureIF, SpecialResolutionIF, StaffPaymentStepIF, UploadAffidavitIF } from '@/interfaces'
import { CorpTypeCd, DissolutionTypes, EffectOfOrders, FilingTypes, PartyTypes, RoleTypes,
  StaffPaymentOptions } from '@/enums'

/**
 * Mixin that provides the integration with the Legal API.
 */
@Component({})
export default class FilingTemplateMixin extends DateMixin {
  @Getter isTypeCoop!: boolean
  @Getter isTypeSoleProp!: boolean
  @Getter getAffidavitStep!: UploadAffidavitIF
  @Getter getNameRequestNumber!: string
  @Getter getNameRequestApprovedName!: string
  @Getter getBusiness!: BusinessIF
  @Getter getBusinessLegalName!: string
  @Getter getBusinessFoundingDate!: string
  @Getter getDissolutionType!: DissolutionTypes
  @Getter getTempId!: string
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getEntityType!: CorpTypeCd
  @Getter getCurrentDate!: string
  @Getter getCertifyState!: CertifyIF
  @Getter getDefineCompanyStep!: DefineCompanyIF
  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter getCreateShareStructureStep!: ShareStructureIF
  @Getter getIncorporationAgreementStep!: IncorporationAgreementIF
  @Getter getBusinessContact!: ContactPointIF
  @Getter getCreateRulesStep!: CreateRulesIF
  @Getter getCreateMemorandumStep!: CreateMemorandumIF
  @Getter getMemorandum!: any
  @Getter getCreateResolutionStep!: CreateResolutionIF
  @Getter getResolution!: any
  @Getter getBusinessId!: string
  @Getter getDocumentDelivery!: DocumentDeliveryIF
  @Getter getStaffPaymentStep!: StaffPaymentStepIF
  @Getter getCourtOrderStep!: CourtOrderStepIF
  @Getter isRoleStaff!: boolean
  @Getter getDissolutionStatementStep!: DissolutionStatementIF
  @Getter getDissolutionCustodian!: OrgPersonIF
  @Getter getFolioNumber!: string
  @Getter getTransactionalFolioNumber!: string
  @Getter isPremiumAccount!: boolean
  @Getter getRegistration!: RegistrationStateIF
  @Getter getRestoration!: RestorationStateIF
  @Getter getFilingId!: number
  @Getter getCompletingParty!: CompletingPartyIF
  @Getter getDissolutionDate!: string
  @Getter isTypeFirm!: boolean

  @Action setAffidavit!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF
  @Action setEntityType!: ActionBindingIF
  @Action setBusinessAddress!: ActionBindingIF
  @Action setBusinessContact!: ActionBindingIF
  @Action setDissolutionType!: ActionBindingIF
  @Action setLegalName!: ActionBindingIF
  @Action setFoundingDate!: ActionBindingIF
  @Action setCooperativeType!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setNameTranslationState!: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setOrgPersonList!: ActionBindingIF
  @Action setCertifyState!: ActionBindingIF
  @Action setShareClasses!: ActionBindingIF
  @Action setEffectiveDate!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setFolioNumber!: ActionBindingIF
  @Action setTransactionalFolioNumber!: ActionBindingIF
  @Action setIncorporationAgreementStepData!: ActionBindingIF
  @Action setRules!: ActionBindingIF
  @Action setMemorandum!: ActionBindingIF
  @Action setCourtOrderFileNumber!: ActionBindingIF
  @Action setHasPlanOfArrangement!: ActionBindingIF
  @Action setStaffPayment!: ActionBindingIF
  @Action setResolution!: ActionBindingIF
  @Action setDocumentOptionalEmail!: ActionBindingIF
  @Action setDissolutionStatementStepData!: ActionBindingIF
  @Action setCustodianOfRecords!: ActionBindingIF
  @Action setRegistrationStartDate!: ActionBindingIF
  @Action setRegistrationBusinessAddress!: ActionBindingIF
  @Action setRegistrationFeeAcknowledgement!: ActionBindingIF
  @Action setRegistrationNaics!: ActionBindingIF
  @Action setRegistrationBusinessNumber!: ActionBindingIF
  @Action setIsAutoPopulatedBusinessNumber!: ActionBindingIF
  @Action setRegistrationBusinessType!: ActionBindingIF
  @Action setRegistrationBusinessTypeConfirm!: ActionBindingIF
  @Action setDissolutionDate!: ActionBindingIF

  /**
   * Builds an incorporation filing from store data. Used when saving a filing.
   * @returns the filing body to save
   */
  buildIncorporationFiling (): IncorporationFilingIF {
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
        parties: this.getAddPeopleAndRoleStep.orgPeople
      }
    }

    // Conditionally add the entity-specific sections.
    switch (this.getEntityType) {
      case CorpTypeCd.COOP:
        filing.incorporationApplication.cooperative = {
          cooperativeAssociationType: this.getDefineCompanyStep.cooperativeType,
          rulesFileKey: this.getCreateRulesStep.docKey || null,
          rulesFileName: this.getCreateRulesStep.rulesDoc?.name || null,
          rulesFileSize: this.getCreateRulesStep.rulesDoc?.size || null,
          rulesFileLastModified: this.getCreateRulesStep.rulesDoc?.lastModified || null,
          rulesConfirmed: this.getCreateRulesStep.rulesConfirmed || false,
          memorandumFileKey: this.getCreateMemorandumStep.docKey || null,
          memorandumFileName: this.getCreateMemorandumStep?.memorandumDoc?.name || null,
          memorandumFileSize: this.getCreateMemorandumStep?.memorandumDoc?.size || null,
          memorandumFileLastModified: this.getCreateMemorandumStep?.memorandumDoc?.lastModified || null,
          memorandumConfirmed: this.getCreateMemorandumStep.memorandumConfirmed || false
        }
        break
      case CorpTypeCd.BENEFIT_COMPANY:
      case CorpTypeCd.BC_CCC:
      case CorpTypeCd.BC_COMPANY:
      case CorpTypeCd.BC_ULC_COMPANY:
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

    // If this is a named IA then add Name Request Number and Approved Name.
    if (this.getNameRequestNumber) {
      filing.incorporationApplication.nameRequest.nrNumber = this.getNameRequestNumber
      filing.incorporationApplication.nameRequest.legalName = this.getNameRequestApprovedName
    }

    // If this is a future effective filing then save the effective date.
    if (this.getEffectiveDateTime.isFutureEffective) {
      filing.header.effectiveDate = this.dateToApi(this.getEffectiveDateTime.effectiveDate)
    }

    return filing
  }

  /**
   * Parses a draft incorporation filing into the store. Used when loading a filing.
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
    this.setNameTranslationState(draftFiling.incorporationApplication.nameTranslations || [])

    // restore Contact Info
    this.setBusinessContact({
      ...draftFiling.incorporationApplication.contactPoint,
      confirmEmail: draftFiling.incorporationApplication.contactPoint.email
    })

    // restore Persons and Organizations
    this.setOrgPersonList(draftFiling.incorporationApplication.parties || [])

    // conditionally restore the entity-specific sections
    switch (this.getEntityType) {
      case CorpTypeCd.COOP: {
        // restore Cooperative type
        this.setCooperativeType(draftFiling.incorporationApplication.cooperative?.cooperativeAssociationType)

        // restore Rules
        let rulesDoc = null as DocIF
        if (draftFiling.incorporationApplication.cooperative?.rulesFileKey) {
          rulesDoc = {
            name: draftFiling.incorporationApplication.cooperative?.rulesFileName,
            lastModified: draftFiling.incorporationApplication.cooperative?.rulesFileLastModified,
            size: draftFiling.incorporationApplication.cooperative?.rulesFileSize
          }
        }
        const createRules: CreateRulesIF = {
          validationDetail: {
            valid: false,
            validationItemDetails: []
          },
          rulesConfirmed: draftFiling.incorporationApplication.cooperative?.rulesConfirmed,
          rulesDoc,
          docKey: draftFiling.incorporationApplication.cooperative?.rulesFileKey
        }
        this.setRules(createRules)

        // restore Memorandum
        let memorandumDoc = null as DocIF
        if (draftFiling.incorporationApplication.cooperative?.memorandumFileKey) {
          memorandumDoc = {
            name: draftFiling.incorporationApplication.cooperative?.memorandumFileName,
            lastModified: draftFiling.incorporationApplication.cooperative?.memorandumFileLastModified,
            size: draftFiling.incorporationApplication.cooperative?.memorandumFileSize
          }
        }
        const createMemorandum: CreateMemorandumIF = {
          validationDetail: {
            valid: false,
            validationItemDetails: []
          },
          memorandumConfirmed: draftFiling.incorporationApplication.cooperative?.memorandumConfirmed,
          memorandumDoc,
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
          agreementType: draftFiling.incorporationApplication.incorporationAgreement?.agreementType
        })
        // set courtOrder attribute
        this.setCourtOrderFileNumber(draftFiling.incorporationApplication.courtOrder?.fileNumber || '')
        this.setHasPlanOfArrangement(draftFiling.incorporationApplication.courtOrder?.hasPlanOfArrangement || false)
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
        legalName: this.getBusinessLegalName,
        foundingDate: this.getBusinessFoundingDate
      },
      // *** TODO: add/remove properties as needed
      restoration: {
        date: this.getRestoration.date,
        type: this.getRestoration.type,
        expiry: this.getRestoration.expiry || undefined, // can't be null
        nameRequest: {
          legalName: this.getNameRequestApprovedName,
          legalType: this.getEntityType,
          nrNumber: this.getNameRequestNumber
        },
        nameTranslations: this.getNameTranslations,
        parties: this.orgPersonsToParties(this.getAddPeopleAndRoleStep.orgPeople)
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

    // restore Contact Info
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

    // NB: no need to restore Name Request data
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
    this.setEntityType(draftFiling.business.legalType)
    this.setLegalName(draftFiling.business.legalName)
    this.setFoundingDate(draftFiling.business.foundingDate)

    // restore Restoration data

    // *** TODO: restore date
    // *** TODO: restore type
    // *** TODO: restore expiry

    // NB: no need to restore Name Request data
    // it will be reloaded from NR endpoint in App.vue

    // restore Name Translations
    this.setNameTranslationState(draftFiling.restoration.nameTranslations || [])

    // restore Persons and Organizations
    this.setOrgPersonList(this.partiesToOrgPersons(draftFiling.restoration.parties || []))

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
        name: FilingTypes.VOLUNTARY_DISSOLUTION,
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
        foundingDate: this.getBusinessFoundingDate
      },
      dissolution: {
        dissolutionDate: this.getCurrentDate,
        affidavitConfirmed: this.getAffidavitStep.validationDetail.validationItemDetails[0]?.valid || false,
        custodialOffice: this.getBusiness.officeAddress,
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
          affidavitFileName: this.getAffidavitStep.affidavitDoc?.name || null,
          affidavitFileSize: this.getAffidavitStep.affidavitDoc?.size || null,
          affidavitFileLastModified: this.getAffidavitStep.affidavitDoc?.lastModified || null
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
    this.setEntityType(draftFiling.business.legalType)
    this.setLegalName(draftFiling.business.legalName)
    this.setFoundingDate(draftFiling.business.foundingDate)

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
    let affidavitDoc = null as DocIF
    if (draftFiling.dissolution?.affidavitFileKey) {
      affidavitDoc = {
        name: draftFiling.dissolution.affidavitFileName,
        lastModified: draftFiling.dissolution.affidavitFileLastModified,
        size: draftFiling.dissolution.affidavitFileSize
      }
    }
    const uploadAffidavit: UploadAffidavitIF = {
      validationDetail: {
        valid: false,
        validationItemDetails: []
      },
      affidavitConfirmed: draftFiling.dissolution?.affidavitConfirmed,
      affidavitDoc,
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
  private buildStaffPayment (filing: DissolutionFilingIF | RegistrationFilingIF | RestorationFilingIF): void {
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
  private parseStaffPayment (filing: DissolutionFilingIF): void {
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
