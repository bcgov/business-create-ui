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
  date: string // FUTURE: describe format here
  type: RestorationTypes
  expiry?: string // FUTURE: describe format here
  // defineBusinessValid: boolean
  // startDate: string
  // businessAddress: BusinessAddressIF
  // businessNumber?: string
}
