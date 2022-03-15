import { BusinessAddressIF, NaicsIF } from '@/interfaces'
import { CorpTypeCd } from '@/enums'

export interface RegistrationNameRequestIF {
  legalName: string
  legalType: CorpTypeCd
  nrNumber: string
}

export const EmptyRegistrationNameRequest: RegistrationNameRequestIF = {
  legalName: null,
  legalType: null,
  nrNumber: null
}

export interface RegistrationStateIF {
  defineBusinessValid: boolean
  startDate: string
  businessAddress: BusinessAddressIF
  feeAcknowledgement: boolean
  naics: NaicsIF
  nameRequest: RegistrationNameRequestIF
}
