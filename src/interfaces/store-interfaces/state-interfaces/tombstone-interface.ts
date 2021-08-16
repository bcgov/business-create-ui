import { AddressIF } from '@/interfaces/stepper-interfaces/DefineCompany/address-interface'

// Tombstone State model
export interface TombstoneIF {
  keycloakRoles: Array<string>
  authRoles: Array<string>
  userEmail: string // from auth user info
  userFirstName: string // from auth user info
  userLastName: string // from auth user info
  userAddress: AddressIF // from auth org info
}
