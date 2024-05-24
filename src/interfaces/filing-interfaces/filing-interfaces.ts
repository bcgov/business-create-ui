import { AmalgamatingBusinessIF, BusinessAddressIF, ContinuationAuthorizationIF, CourtOrderIF, NaicsIF,
  NameTranslationIF, OfficeAddressIF, OrgPersonIF, PartyIF, RegisteredRecordsAddressesIF, ShareClassIF,
  SpecialResolutionIF } from '@/interfaces'
import { AmalgamationTypes, ApprovalTypes, BusinessTypes, DissolutionStatementTypes, DissolutionTypes,
  FilingTypes, RestorationTypes, RelationshipTypes } from '@/enums'
import { CorrectNameOptions, EntityStates } from '@bcrs-shared-components/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

/**
 * Name Request interface for filings.
 * Not the same as NR data from Namex API.
 * Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/name_request.json
 */
export interface NameRequestFilingIF {
  legalType: CorpTypeCd
  legalName?: string // only set when there is a name change (including NR)
  nrNumber?: string // only set when there is an NR
  correctNameOption?: CorrectNameOptions // only used by UI for save and resume
  applicantPhone?: string // only used by UI for save and resume
  applicantEmail?: string // only used by UI for save and resume
}

/** Interface for amalgamation filing data saved to the Legal API. */
export interface AmalgamationFilingIF {
  header: {
    name: FilingTypes
    certifiedBy: string
    date: string
    effectiveDate?: string // should be set only for future effective filings
    filingId?: number // for existing filings (not used when building a new filing)
    folioNumber?: string // only displayed for certain account types
    isFutureEffective: boolean

    // staff payment properties:
    routingSlipNumber?: string
    bcolAccountNumber?: string
    datNumber?: string
    waiveFees?: boolean
    priority?: boolean
  }
  business: {
    legalType: CorpTypeCd
    identifier: string
  }
  amalgamationApplication: {
    amalgamatingBusinesses: AmalgamatingBusinessIF[]
    courtApproval: boolean
    type: AmalgamationTypes
    nameRequest: NameRequestFilingIF
    nameTranslations: NameTranslationIF[]
    offices: RegisteredRecordsAddressesIF | object
    contactPoint: ContactPointIF
    parties: PartyIF[]

    // BEN / CC / BC / ULC only:
    shareStructure?: {
      shareClasses: ShareClassIF[]
    }
    incorporationAgreement?: {
      agreementType: string
    }
    // ULC only:
    courtOrder?: CourtOrderIF
  }
}

/**
 * Interface for continuation in filing data saved to the Legal API.
 * Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/continuation_in.json
 */
export interface ContinuationInFilingIF {
  header: {
    name: FilingTypes
    certifiedBy: string
    date: string
    effectiveDate?: string // should be set only for future effective filings
    filingId?: number // for existing filings (not used when building a new filing)
    folioNumber?: string // only displayed for certain account types
    isFutureEffective: boolean

    // staff payment properties:
    routingSlipNumber?: string
    bcolAccountNumber?: string
    datNumber?: string
    waiveFees?: boolean
    priority?: boolean
  }
  business: {
    identifier: string
    legalType: CorpTypeCd
  }
  continuationIn: {
    business?: { // expro data in BC
      foundingDate: string // API format
      identifier: string
      legalName: string
    }
    foreignJurisdiction: { // data in home jurisdiction
      country: string
      region?: string
      legalName: string
      identifier: string
      incorporationDate: string // YYYY-MM-DD
      taxId?: string
      affidavitFile?: File
      affidavitFileKey?: string
      affidavitFileName?: string
      affidavitFileUrl?: string
    }
    authorization: ContinuationAuthorizationIF
    contactPoint: ContactPointIF
    nameRequest: NameRequestFilingIF
    nameTranslations: NameTranslationIF[]
    offices: RegisteredRecordsAddressesIF
    parties: OrgPersonIF[]
    shareStructure: { shareClasses: ShareClassIF[] }
    courtOrder?: CourtOrderIF
    isConfirmed?: boolean // used only by UI
    mode?: 'EXPRO' | 'MANUAL' // used only by UI
    status?: EntityStates // only used by UI
  }
}

/** Interface for incorporation filing data saved to the Legal API. */
export interface IncorporationFilingIF {
  header: {
    name: FilingTypes
    certifiedBy: string
    date: string
    effectiveDate?: string // should be set only for future effective filings
    filingId?: number // for existing filings (not used when building a new filing)
    folioNumber?: string // only displayed for certain account types
    isFutureEffective: boolean

    // staff payment properties:
    routingSlipNumber?: string
    bcolAccountNumber?: string
    datNumber?: string
    waiveFees?: boolean
    priority?: boolean
  }
  business: {
    legalType: CorpTypeCd
    identifier: string
  }
  incorporationApplication: {
    nameRequest: NameRequestFilingIF
    nameTranslations: NameTranslationIF[]
    offices: RegisteredRecordsAddressesIF | object
    contactPoint: ContactPointIF
    parties: PartyIF[]

    // BEN / CC / BC / ULC only:
    shareStructure?: {
      shareClasses: ShareClassIF[]
    }
    incorporationAgreement?: {
      agreementType: string
    }
    // ULC only:
    courtOrder?: CourtOrderIF

    // CP only:
    rules?: any
    memorandum?: any
    cooperative?: {
      cooperativeAssociationType: string
      rulesConfirmed: boolean
      rulesFileKey: string
      rulesFileName: string
      rulesFileSize: number
      rulesFileLastModified: number
      memorandumConfirmed: boolean
      memorandumFileKey: string
      memorandumFileName: string
      memorandumFileSize: number
      memorandumFileLastModified: number
    }
  }
}

/** Interface for registration filing data saved to the Legal API. */
export interface RegistrationFilingIF {
  header: {
    name: FilingTypes
    certifiedBy: string
    date: string
    effectiveDate?: string // not saved by UI but may be provided by API
    filingId?: number // not saved by UI but may be provided by API
    folioNumber?: string // optional and only displayed for certain account types
    isTransactionalFolioNumber?: boolean // Optional - Premium accounts only
    isFutureEffective: boolean

    // staff payment properties:
    routingSlipNumber?: string
    bcolAccountNumber?: string
    datNumber?: string
    waiveFees?: boolean
    priority?: boolean
  }
  business: {
    legalType: CorpTypeCd
    identifier: string
  }
  registration: {
    business: {
      identifier: string
      naics?: NaicsIF
      taxId?: string // aka Business Number
    }
    offices: {
      businessOffice: BusinessAddressIF
    }
    businessType: BusinessTypes
    contactPoint: ContactPointIF
    nameRequest: NameRequestFilingIF
    parties: PartyIF[]
    startDate: string
    businessTypeConfirm: boolean

    // For UI purpose only
    isAutoPopulatedBusinessNumber: boolean // Will be true if BN is auto populated from business lookup
  }
}

/** Interface for dissolution filing data saved to the Legal API. */
export interface DissolutionFilingIF {
  header: {
    name: FilingTypes
    certifiedBy: string
    date: string
    effectiveDate?: string // Optional and should be set only for future effective filings
    filingId?: number // Optional as this is not required when building a filing - causes an error for new filings
    folioNumber?: string // Optional - applies to diss Premium accounts or diss BCOL staff payments (not both)
    isTransactionalFolioNumber?: boolean // Optional - Premium accounts only
    isFutureEffective: boolean
    documentOptionalEmail?: string // Optional for staff to provide user email

    // staff payment properties:
    routingSlipNumber?: string
    bcolAccountNumber?: string
    datNumber?: string
    waiveFees?: boolean
    priority?: boolean
  }
  business: {
    legalType: CorpTypeCd
    identifier: string
    legalName: string
    foundingDate: string
    startDate: string // Populated/used only (not NULL) in Firm Dissolution filing
  }
  dissolution: {
    dissolutionDate: string
    custodialOffice: OfficeAddressIF
    dissolutionType: DissolutionTypes
    dissolutionStatementType?: DissolutionStatementTypes
    affidavitConfirmed: boolean
    affidavitFileKey?: string
    affidavitFileName?: string
    affidavitFileSize?: number
    affidavitFileLastModified?: number
    courtOrder?: CourtOrderIF
    parties: PartyIF[]

    // Only one of resolution and specialResolution will be used.  Resolution is strictly
    // defined here to support saving of resolutionConfirmed state.  The Legal API only
    // uses the specialResolution property.
    resolution?: {
      resolutionConfirmed: boolean
    }
  }
  specialResolution?: SpecialResolutionIF
}

/** Interface for restoration filing data saved to the Legal API. */
export interface RestorationFilingIF {
  header: {
    name: FilingTypes
    certifiedBy: string
    date: string
    effectiveDate?: string // not saved by UI but may be provided by API
    filingId?: number // not saved by UI but may be provided by API
    folioNumber?: string // optional and only displayed for certain account types
    isTransactionalFolioNumber?: boolean // Optional - Premium accounts only
    isFutureEffective: boolean

    // staff payment properties:
    routingSlipNumber?: string
    bcolAccountNumber?: string
    datNumber?: string
    waiveFees?: boolean
    priority?: boolean
  }
  business: {
    foundingDate: string
    identifier: string
    legalType: CorpTypeCd
  }
  restoration: {
    applicationDate?: string // YYYY-MM-DD
    approvalType?: ApprovalTypes
    contactPoint: ContactPointIF
    courtOrder?: CourtOrderIF
    expiry?: string // YYYY-MM-DD
    nameRequest?: NameRequestFilingIF
    nameTranslations?: NameTranslationIF[]
    noticeDate?: string // YYYY-MM-DD
    offices: RegisteredRecordsAddressesIF | object
    parties: PartyIF[]
    relationships?: RelationshipTypes[]
    type: RestorationTypes
  }
}
