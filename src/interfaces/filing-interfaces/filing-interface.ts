import { IncorporationAddressIf } from '@/interfaces/stepper-interfaces/DefineCompany/address-interface'
import { OrgPersonIF, ShareClassIF } from '@/interfaces'

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
      offices: IncorporationAddressIf | {},
      contactPoint: {
        email: string
        phone: string
        extension: string
      },
      parties: OrgPersonIF[],
      shareClasses: ShareClassIF[],
      incorporationAgreement: {
        agreementType: string
      }
    }
  }
}
