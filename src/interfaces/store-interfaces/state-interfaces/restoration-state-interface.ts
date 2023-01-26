import { CorpTypeCd, RestorationTypes } from '@/enums'

export interface RestorationNameRequestIF {
  legalName: string
  legalType: CorpTypeCd
  nrNumber: string
}

// *** TODO: add/remove properties as needed
export interface RestorationStateIF {
  applicantInfoValid: boolean
  businessInfoValid: boolean
  businessNameValid: boolean
  date: string // YYYY-MM-DD
  type: RestorationTypes
  expiry?: string // YYYY-MM-DD
  // defineBusinessValid: boolean
  // startDate: string
  // businessAddress: BusinessAddressIF
  // businessNumber?: string
}
