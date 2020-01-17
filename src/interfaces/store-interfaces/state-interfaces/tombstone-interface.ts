// Tombstone State model
export interface TombStoneIF {
  keycloakRoles: Array<string>
  authRoles: Array<string>
  entityType: string | null
}
