import { BusinessAddressIF, CourtOrderIF, RegisteredRecordsAddressesIF, NaicsIF, NameTranslationIF,
  OfficeAddressIF, PartyIF, ShareClassIF, SpecialResolutionIF } from '@/interfaces'
import { ApprovalTypes, BusinessTypes, DissolutionStatementTypes, DissolutionTypes, FilingTypes,
  RestorationTypes, RelationshipTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

/**
 * Name Request interface for filings.
 * Not the same as NR data from Namex API.
 * Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/name_request.json
 */
interface NameRequestFilingIF {
  legalType: CorpTypeCd
  legalName?: string // only set when there is a name change (including NR)
  nrNumber?: string // only set when there is an NR
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
    name: string
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
    name: string
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
    name: string
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
    legalName: string
    legalType: CorpTypeCd
  }
  restoration: {
    applicationDate: string // YYYY-MM-DD
    approvalType: ApprovalTypes
    contactPoint: ContactPointIF
    courtOrder: CourtOrderIF
    expiry: string // YYYY-MM-DD
    nameRequest: NameRequestFilingIF
    nameTranslations: NameTranslationIF[]
    noticeDate: string // YYYY-MM-DD
    offices: RegisteredRecordsAddressesIF | object
    parties: PartyIF[]
    relationships: RelationshipTypes[]
    type: RestorationTypes
  }
}
