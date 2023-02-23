import { BusinessAddressIF, NaicsIF } from '@/interfaces'
import { BusinessTypes } from '@/enums'

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
