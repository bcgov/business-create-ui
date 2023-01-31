import { RegisteredRecordsAddressesIF } from '@/interfaces'
import { CoopTypes } from '@/enums'

export interface DefineCompanyIF {
  valid: boolean
  cooperativeType: CoopTypes
  officeAddresses: RegisteredRecordsAddressesIF | object
}
