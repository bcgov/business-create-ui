import { BusinessAddressIF } from '@/interfaces'
import { CorpTypeCd } from '@/enums'

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
  // defineBusinessValid: boolean
  // startDate: string
  // businessAddress: BusinessAddressIF
  // businessNumber?: string
}
