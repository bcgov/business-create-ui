import { AddressIF } from '@/interfaces'
import { AuthorizedActions, FilingStatus, FilingTypes } from '@/enums'

// Tombstone State model
export interface TombstoneIF {
  filingStatus?: FilingStatus
  filingType: FilingTypes
  authorizedActions: Array<AuthorizedActions>
  legalName: string
  keycloakGuid: string // from auth user info
  userEmail: string // from auth user info
  userPhone: string // from auth user info
  userFirstname: string // from auth user info
  userLastname: string // from auth user info
  userLoginSource: string // from auth user info
  userAddress: AddressIF // from auth org info
  folioNumber: string // from auth user info or from user
  folioNumberValid: boolean
  transactionalFolioNumber: string
  transactionalFolioNumberValid: boolean
}
