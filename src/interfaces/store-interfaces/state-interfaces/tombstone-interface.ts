// Tombstone State model
export interface TombStoneIF {
  keycloakRoles: Array<string>
  authRoles: Array<string>
  userEmail: string // from auth profile
}
