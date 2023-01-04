import { BusinessAddressIF } from '@/interfaces'
import { CorpTypeCd } from '@/enums'

export interface RestorationNameRequestIF {
  legalName: string
  legalType: CorpTypeCd
  nrNumber: string
}

// *** TODO: update
export interface RestorationStateIF {
  applicantInfoValid: boolean
  businessInfoValid: boolean
  businessNameValid: boolean
  // defineBusinessValid: boolean
  // startDate: string
  // businessAddress: BusinessAddressIF
  // businessNumber?: string
}
