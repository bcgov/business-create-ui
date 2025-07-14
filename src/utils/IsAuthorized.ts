import { useStore } from '@/store/store'
import { AuthorizedActions } from '@/enums'

/**
 * Whether the specified action (aka permission) is authorized for the current user.
 * @returns True or False
 */
export function IsAuthorized (action: AuthorizedActions): boolean {
  const store = useStore()
  return store.getAuthorizedActions.includes(action)
}
