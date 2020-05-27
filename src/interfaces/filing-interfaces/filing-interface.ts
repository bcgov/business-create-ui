import { IncorporationAddressIf } from '@/interfaces/stepper-interfaces/DefineCompany/address-interface'
import { OrgPersonIF, ShareClassIF } from '@/interfaces'

export interface IncorporationFilingIF {
  filing: {
    header: {
      name: string
      certifiedBy: string
      email: string
      date: string
      effectiveDate?: string // Optional and should be set only for future effective filings
      filingId?: number // Optional as this is not required when building a filing - causes an error for new filings
      folioNumber?: string // Optional to the user and only displayed for certain account types
    },
    incorporationApplication: {
      nameRequest: {
        nrNumber: string
        legalType: string
        legalName: string
      },
      offices: IncorporationAddressIf | {},
      contactPoint: {
        email: string
        phone: string
        extension: string
      },
      parties: OrgPersonIF[],
      shareClasses: ShareClassIF[]
    }
  }
}
