import { EntityStates } from '@bcrs-shared-components/enums'

export interface ExistingBusinessInfoIF {
  affidavitFile?: File // only used by UI
  affidavitFileKey?: string
  affidavitFileName?: string
  affidavitFileUrl?: string // presigned URL for future deletion (ticket 21110)
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
  isConfirmed?: boolean // only used by UI
  mode: 'EXPRO' | 'MANUAL' // only used by UI
  status?: EntityStates // only used by UI
  taxId?: string
}

// *** TODO: delete this if not used
export const EmptyExistingBusinessInfoIF: ExistingBusinessInfoIF = {
  homeJurisdiction: {
    country: '',
    region: ''
  },
  homeIdentifier: '',
  homeIncorporationDate: '',
  homeLegalName: '',
  mode: null,
  status: null,
  taxId: ''
}
