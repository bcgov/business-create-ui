// Getters for Roles
export const isRoleStaff = (state: any): boolean => {
  return state.tombStoneModel.keycloakRoles.includes('staff')
}

export const isRoleEdit = (state: any): boolean => {
  return state.tombStoneModel.authRoles.includes('edit')
}

export const isRoleView = (state: any): boolean => {
  return state.tombStoneModel.authRoles.includes('view')
}
