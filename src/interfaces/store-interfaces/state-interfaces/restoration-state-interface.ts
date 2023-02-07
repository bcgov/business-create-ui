import { CorpTypeCd, RestorationTypes, RelationshipTypes } from '@/enums'

export interface RestorationNameRequestIF {
  legalName: string
  legalType: CorpTypeCd
  nrNumber: string
}

export interface RestorationStateIF {
  businessInfoValid: boolean
  businessNameValid: boolean
  type: RestorationTypes
  expiry?: string // YYYY-MM-DD
  relationships?: RelationshipTypes[]
  // defineBusinessValid: boolean
  // startDate: string
  // businessAddress: BusinessAddressIF
  // businessNumber?: string
}
