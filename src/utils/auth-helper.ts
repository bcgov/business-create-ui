// Libraries
import axios from '@/utils/axios-auth'

// Vuex Store
import { store } from '@/store'

// Constants
import { SET_KEYCLOAK_ROLES, SET_AUTH_ROLES } from '@/store/constants'

// Interfaces
import { JwtIF, AuthIF } from '@/interfaces'

/**
 * An Auth Helper class to handle fetching and setting authorizations for entities from the Auth API.
 */
export default class AuthenticationService {
  // Authentication Properties
  private authAPIURL: string | null
  private businessId: string | null

  /**
   * Constructor to initialize properties.
   */
  constructor () {
    this.authAPIURL = sessionStorage.getItem('AUTH_API_URL')
    this.businessId = sessionStorage.getItem('BUSINESS_IDENTIFIER')
  }

  /**
   * Parent method to handle the Get, Parse and Storing of the keycloak roles.
   */
  getJwtRoles = (): void => {
    try {
      // get initial data
      const jwt = this.getJWT()
      const keycloakRoles = this.getKeycloakRoles(jwt)

      // Set the keycloak roles to store
      store.dispatch(SET_KEYCLOAK_ROLES, keycloakRoles)
    } catch (error) {
      throw new Error('Error Fetching Keycloak roles')
    }
  }

  /**
   * Get the token and Parse it from keycloak token.
   * @return A parsed JWT.
   */
  getJWT = (): JwtIF => {
    const token = sessionStorage.getItem('KEYCLOAK_TOKEN')
    if (token) {
      return this.parseJwt(token)
    }
    throw new Error('Error getting Keycloak token')
  }

  /**
   * Decode and parse the JWT to a readable state.
   * @param token The token to be decoded & parsed.
   * @return A Parsed Token.
   */
  parseJwt = (token: string): JwtIF => {
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
   * @param jwt The JWT from which the roles are parsed.
   */
  getKeycloakRoles = (jwt: JwtIF): Array<string> => {
    const keycloakRoles = jwt.roles
    if (keycloakRoles && keycloakRoles.length > 0) {
      return keycloakRoles
    }
    throw new Error('Error getting Keycloak roles')
  }

  /**
   * Method to retrieve authorizations for specific entities.
   * @param businessId The id of the specified business.
   * @returns A promise of data from the Auth Endpoint.
   */
  getAuthorizations (): Promise<any> {
    try {
      const url = this.businessId + '/authorizations'
      const config = {
        baseURL: this.authAPIURL + 'entities/'
      }
      return axios.get(url, config).then(data => this.storeAuthRoles(data))
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * Method to validate and store auth roles.
   * @param response The response data to be parsed and stored.
   */
  storeAuthRoles (response: AuthIF): void {
    const authRoles = response && response.data && response.data.roles
    if (authRoles && authRoles.length > 0) {
      // set auth roles to store
      store.dispatch(SET_AUTH_ROLES, authRoles)
    } else {
      throw new Error('Invalid auth roles')
    }
  }
}
