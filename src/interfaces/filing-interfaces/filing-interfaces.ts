import {
  OfficeAddressIF,
  BusinessAddressIF,
  CourtOrderIF,
  IncorporationAddressIF,
  NameTranslationIF,
  NaicsIF,
  PartyIF,
  ShareClassIF,
  SpecialResolutionIF
} from '@/interfaces'
import { BusinessTypes, CorpTypeCd, DissolutionStatementTypes, DissolutionTypes, FilingTypes } from '@/enums'
import { RegistrationNameRequestIF } from '../store-interfaces/state-interfaces/registration-state-interface'

/** Interface for incorporation filing data saved to the Legal API. */
export interface IncorporationFilingIF {
  header: {
    name: FilingTypes
    certifiedBy: string
    date: string
    effectiveDate?: string // Optional and should be set only for future effective filings
    filingId?: number // Optional as this is not required when building a filing - causes an error for new filings
    folioNumber?: string // Optional to the user and only displayed for certain account types
    isFutureEffective: boolean
  }
  business: {
    legalType: CorpTypeCd
    identifier: string
  }
  incorporationApplication: {
    // NB: nameRequest must match schema
    nameRequest: {
      legalType: CorpTypeCd
      nrNumber?: string // only set when there is an NR
      legalName?: string // only set when there is an NR
    }
    nameTranslations: NameTranslationIF[]
    offices: IncorporationAddressIF | object
    contactPoint: {
      email: string
      phone: string
      extension?: number
    }
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
    contactPoint: {
      email: string
      extension?: number
      phone: string
    }
    nameRequest: RegistrationNameRequestIF
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
    legalType: CorpTypeCd
    identifier: string
    legalName: string
    foundingDate: string
  }
  // *** TODO: update according to schema
  restoration: {
    date: any
    type: any
    expiry: any
    nameTranslations: NameTranslationIF[]
    nameRequest: RegistrationNameRequestIF
    parties: PartyIF[]
  }
}
