import { EntityStates } from '@bcrs-shared-components/enums'

export interface ExistingBusinessInfoIF {
  affidavitFile?: File // only used by UI
  affidavitFileKey?: string
  affidavitFileName?: string
  bcFoundingDate?: string // expro only (YYYY-MM-DD)
  bcIdentifier?: string // expro only
  bcLegalName?: string // expro only
  homeJurisdiction: {
    country: string
    region?: string
  }
  homeIdentifier: string
  homeIncorporationDate: string // YYYY-MM-DD
  homeLegalName: string
  latestReviewComment?: string
  mode: 'EXPRO' | 'MANUAL' // only used by UI
  status?: EntityStates // only used by UI
  taxId?: string
}
