// Vuex Store
import { store } from '@/store'

// Interface
import { JwtIF } from '@/interfaces'

/**
 * Parent method to handle the Get, Parse and Storing of the keycloak roles.
 */
export const getJwtRoles = (): void => {
  try {
    // get initial data
    const jwt = getJWT()
    const keycloakRoles = getKeycloakRoles(jwt)

    // Set the roles to store
    store.dispatch('setTombStone', keycloakRoles)
  } catch (error) {
    console.error(error)
  }
}

/**
 * Get the token and Parse it from keycloak token.
 */
const getJWT = (): JwtIF => {
  const token = sessionStorage.getItem('KEYCLOAK_TOKEN')
  if (token) {
    return parseJwt(token)
  }
  throw new Error('Error getting Keycloak token')
}

/**
 * Decode and parse the JWT to a readable state.
 *
 * @param token The token to be decoded & parsed.
 */
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = decodeURIComponent(window.atob(base64Url).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(base64)
  } catch (error) {
    throw new Error('Error parsing JWT - ' + error)
  }
}

/**
 * Get the roles from the parsed JWT.
 *
 * @param jwt The JWT from which the roles are parsed.
 */
const getKeycloakRoles = (jwt: JwtIF) => {
  console.log(jwt)
  const keycloakRoles = jwt.roles
  if (keycloakRoles && keycloakRoles.length > 0) {
    return keycloakRoles
  }
  throw new Error('Error getting Keycloak roles')
}
