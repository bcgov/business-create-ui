import { EntityStates } from '@bcrs-shared-components/enums'

export interface ExistingBusinessInfoIF {
  affidavitFileKey?: string
  businessIdentifier?: string // identifier in BC (expro only)
  businessLegalName?: string // legal name in BC (expro only)
  homeJurisdiction: {
    country: string
    region?: string
  }
  identifier: string // identifier in home jurisdiction
  incorporationDate: string // incorporation date in home jurisdiction // YYYY-MM-DD
  isConfirmed?: boolean // only used by UI
  isUlc?: boolean // only used by UI
  legalName: string // legal name in home jurisdiction
  mode: 'LOOKUP' | 'MANUAL' // only used by UI
  status?: EntityStates // only used by UI
  taxId?: string
}

export const EmptyExistingBusinessInfoIF: ExistingBusinessInfoIF = {
  homeJurisdiction: {
    country: '',
    region: ''
  },
  identifier: '',
  incorporationDate: '',
  legalName: '',
  mode: null,
  status: null,
  taxId: ''
}
