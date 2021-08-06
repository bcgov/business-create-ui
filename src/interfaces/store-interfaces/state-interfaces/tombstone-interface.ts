// Tombstone State model
export interface TombstoneIF {
  keycloakRoles: Array<string>
  authRoles: Array<string>
  userEmail: string // from auth profile
}
