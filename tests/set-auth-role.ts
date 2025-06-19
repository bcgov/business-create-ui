import { AuthorizationRoles } from '@/enums'
import * as Actions from './unit/test-data/AuthorizedActionsLists'

/** Sets the authorized actions (aka permissions) according to Auth Role. */
export function setAuthRole (store: any, authRole: AuthorizationRoles = null): void {
  if (!store) throw new Error('Missing store parameter')

  switch (authRole) {
    case AuthorizationRoles.CONTACT_CENTRE_STAFF: return store.setAuthorizedActions(Actions.ContactCentreStaffActions)
    case AuthorizationRoles.MAXIMUS_STAFF: return store.setAuthorizedActions(Actions.MaximusStaffActions)
    case AuthorizationRoles.PUBLIC_USER: return store.setAuthorizedActions(Actions.PublicUserActions)
    case AuthorizationRoles.SBC_STAFF: return store.setAuthorizedActions(Actions.SbcFieldOfficeStaffActions)
    case AuthorizationRoles.STAFF: return store.setAuthorizedActions(Actions.BusinessRegistryStaffActions)
    default: return store.setAuthorizedActions([])
  }
}
