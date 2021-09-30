import { AddressIF } from '@/interfaces/stepper-interfaces/DefineCompany/address-interface'
import { FilingTypes } from '@/enums'

// Tombstone State model
export interface TombstoneIF {
  authRoles: Array<string>
  businessId: string
  filingType: FilingTypes
  userEmail: string // from auth user info
  userPhone: string // from auth user info
  userFirstName: string // from auth user info
  userLastName: string // from auth user info
  userKeycloakGuid: string // from auth user info
  userAddress: AddressIF // from auth org info
}
