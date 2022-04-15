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
  businessNumber?: string // GPs only
  businessTypeConfirm?: boolean // GPs only
}
