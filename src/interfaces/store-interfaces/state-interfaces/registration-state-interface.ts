import { BusinessAddressIF, NaicsIF } from '@/interfaces'
import { BusinessTypes, CorpTypeCd } from '@/enums'

export interface RegistrationNameRequestIF {
  legalName: string
  legalType: CorpTypeCd
  nrNumber: string
}

export interface RegistrationStateIF {
  defineBusinessValid: boolean
  startDate: string
  businessAddress: BusinessAddressIF
  feeAcknowledgement: boolean
  naics: NaicsIF
  businessType: BusinessTypes
  businessNumber?: string
  isAutoPopulatedBusinessNumber: boolean // Will be true if BN is auto populated from business lookup
  businessTypeConfirm: boolean
}
