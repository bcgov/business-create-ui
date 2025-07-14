import { AddressIF } from '@/interfaces'
import { AuthorizedActions, FilingStatus, FilingTypes } from '@/enums'

// Tombstone State model
export interface TombstoneIF {
  filingStatus?: FilingStatus
  filingType: FilingTypes
  keycloakGuid: string // from KC token
  authorizedActions: Array<AuthorizedActions>
  legalName: string
  userEmail: string // from auth user info
  userPhone: string // from auth user info
  userFirstName: string // from auth user info
  userLastName: string // from auth user info
  userAddress: AddressIF // from auth org info
  folioNumber: string // from auth user info or from user
  folioNumberValid: boolean
  transactionalFolioNumber: string
  transactionalFolioNumberValid: boolean
}
