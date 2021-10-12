import {
  BaseAddressObjIF,
  IncorporationAddressIF
} from '@/interfaces/stepper-interfaces/DefineCompany/address-interface'
import {
  DissolutionResourceIF,
  IncorporationResourceIF,
  NameTranslationIF,
  OrgPersonIF,
  ShareClassIF
} from '@/interfaces'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

/** Interface for incorporation filing data saved to the Legal API. */
export interface IncorporationFilingIF {
  filing: {
    header: {
      name: string
      certifiedBy: string
      date: string
      effectiveDate?: string // Optional and should be set only for future effective filings
      filingId?: number // Optional as this is not required when building a filing - causes an error for new filings
      folioNumber?: string // Optional to the user and only displayed for certain account types
      isFutureEffective: boolean
    },
    business: {
      legalType: string,
      identifier: string
    },
    incorporationApplication: {
      // NB: nameRequest must match schema
      nameRequest: {
        legalType: string
        nrNumber?: string // only set when there is an NR
        legalName?: string // only set when there is an NR
      },
      nameTranslations: NameTranslationIF[],
      offices: IncorporationAddressIF | {},
      contactPoint: {
        email: string
        phone: string
        extension?: number
      },
      parties: OrgPersonIF[],

      // BEN / CC / BC / ULC only:
      shareStructure?: {
        shareClasses: ShareClassIF[]
      },
      incorporationAgreement?: {
        agreementType: string
      },
      // CP only:
      rules?: any,
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
}

/** Interface for incorporation filing data saved to the Legal API. */
export interface DissolutionFilingIF {
  filing: {
    header: {
      name: string
      certifiedBy: string
      date: string
      effectiveDate?: string // Optional and should be set only for future effective filings
      filingId?: number // Optional as this is not required when building a filing - causes an error for new filings
      folioNumber?: string // Optional to the user and only displayed for certain account types
      isFutureEffective: boolean
    },
    business: {
      legalType: CorpTypeCd,
      identifier: string
    },
    dissolution: {
      custodialOffice: BaseAddressObjIF
    }
  }
}
