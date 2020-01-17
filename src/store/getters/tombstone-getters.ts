// Enums
import { EntityTypes } from '@/enums'

export const isRoleStaff = (state: any): boolean => {
  return state.tombStoneModel.keycloakRoles.includes('staff')
}

export const isRoleEdit = (state: any): boolean => {
  return state.tombStoneModel.authRoles.includes('edit')
}

export const isRoleView = (state: any): boolean => {
  return state.tombStoneModel.authRoles.includes('view')
}

export const isEntityType = (state: any): boolean => {
  return !!state.nameRequestModel.entityType
}

export const isTypeBcomp = (state: any): boolean => {
  return (state.nameRequestModel.entityType === EntityTypes.BCOMP)
}

export const isTypeCoop = (state: any): boolean => {
  return (state.nameRequestModel.entityType === EntityTypes.COOP)
}
