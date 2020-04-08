import { IncorporationAddressIf } from '@/interfaces/stepper-interfaces/DefineCompany/address-interface'
import { OrgPersonIF } from '@/interfaces'

export interface IncorporationFilingIF {
  filing: {
    header: {
      name: string
      certifiedBy: string
      email: string
      date: string
      filingId?: number // Optional as this is not required when building a filing - causes an error for new filings
    },
    incorporationApplication: {
      nameRequest: {
        nrNumber: string
        legalType: string
      },
      offices: IncorporationAddressIf | {},
      contactPoint: {
        email: string
        phone: string
      },
      parties: OrgPersonIF[]
    }
  }
}
