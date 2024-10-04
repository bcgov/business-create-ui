import { EntityStates } from '@bcrs-shared-components/enums'

export interface ExistingBusinessInfoIF {
  affidavitFile?: File // only used by UI
  affidavitFileKey?: string
  affidavitFileName?: string
  bcRegistrationDate?: string // expro only (YYYY-MM-DD)
  bcRegistrationNumber?: string // expro only (aka Identifier)
  bcRegisteredName?: string // expro only
  previousJurisdiction: {
    country: string
    region?: string
  }
  prevIncorporationNumber: string
  prevIncorporationDate: string // YYYY-MM-DD
  prevBusinessName: string
  latestReviewComment?: string
  mode: 'EXPRO' | 'MANUAL' // only used by UI
  status?: EntityStates // only used by UI
  businessNumber?: string
}
