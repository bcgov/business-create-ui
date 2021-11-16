import { AddressIF } from '@/interfaces/stepper-interfaces/DefineCompany/address-interface'
import { FilingTypes } from '@/enums'

// Tombstone State model
export interface TombstoneIF {
  authRoles: Array<string>
  filingType: FilingTypes
  legalName: string
  userEmail: string // from auth user info
  userPhone: string // from auth user info
  userFirstName: string // from auth user info
  userLastName: string // from auth user info
  userKeycloakGuid: string // from auth user info
  userAddress: AddressIF // from auth org info
  folioNumber: string // from auth user info or from user
  transactionalFolioNumber: string
  transactionalFolioNumberValid: boolean
}
