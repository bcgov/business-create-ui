import { BusinessAddressIF } from '@/interfaces'
import { CorpTypeCd } from '@/enums'

export interface RegistrationNaicsIF {
  naicsCode: string
  naicsDescription: string
}

export const EmptyRegistrationNaics: RegistrationNaicsIF = {
  naicsCode: null,
  naicsDescription: null
}

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
  naics: RegistrationNaicsIF
  nameRequest: RegistrationNameRequestIF
}
