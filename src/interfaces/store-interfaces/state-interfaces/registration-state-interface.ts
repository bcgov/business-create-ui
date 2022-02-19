import { BusinessAddressIF } from '@/interfaces'

export interface RegistrationStateIF {
  defineBusinessValid: boolean
  startDate: string
  businessAddress: BusinessAddressIF
  feeAcknowledgement: boolean
}
