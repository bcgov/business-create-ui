// Libraries
import axios from '@/utils/axios-auth'

// Vuex Store
import { store } from '@/store'

// Constants
import { SET_KEYCLOAK_ROLES, SET_AUTH_ROLES } from '@/store/constants'

// Interfaces
import { JwtIF, AuthIF } from '@/interfaces'

/**
 * A class to handle authentication using Keycloak token.
 */
export class AuthenticationService {
  /**
   * Gets the JWT, parses it, and stores the Keycloak roles.
   */
  getJwtRoles (): void {
    try {
      // get initial data
      const jwt = this.getJWT()
      const keycloakRoles = this.getKeycloakRoles(jwt)

      // set the keycloak roles to store
      store.dispatch(SET_KEYCLOAK_ROLES, keycloakRoles)
    } catch (error) {
      throw new Error('Error fetching Keycloak roles')
    }
  }

  /**
   * Gets the JWT from session storage and parses it.
   * @returns A parsed JWT.
   */
  private getJWT (): JwtIF {
    const token = sessionStorage.getItem('KEYCLOAK_TOKEN')
    if (token) {
      return this.parseJwt(token)
    }
    throw new Error('Error getting Keycloak token')
  }

  /**
   * Decodes and parses the token to a readable state.
   * @param token The token to be decoded & parsed.
   * @returns A parsed JWT.
   */
  private parseJwt (token: string): JwtIF {
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
   * Gets the Keycloak roles from the parsed JWT.
   * @param jwt The parsed JWT.
   */
  private getKeycloakRoles (jwt: JwtIF): Array<string> {
    const keycloakRoles = jwt.roles
    if (keycloakRoles && keycloakRoles.length > 0) {
      return keycloakRoles
    }
    throw new Error('Invalid Keycloak roles')
  }
}

/**
 * A class to handle authorizations from the Auth API.
 */
export class AuthorizationService {
  // Local Properties
  private authAPIURL: string | null

  /**
   * Initialize local properties.
   */
  constructor () {
    this.authAPIURL = sessionStorage.getItem('AUTH_API_URL')
  }

  /**
   * Retrieves authorizations for specified entity and stores the auth roles.
   * @param businessId The business id of the entity.
   * @returns A promise of data from the Auth endpoint.
   */
  getAuthorizations (businessId: string): Promise<any> {
    try {
      const url = businessId + '/authorizations'
      const config = {
        baseURL: this.authAPIURL + 'entities/'
      }
      return axios.get(url, config).then(data => this.storeAuthRoles(data))
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * Parses, validates and stores the auth roles.
   * @param response The Auth response data.
   */
  private storeAuthRoles (response: AuthIF): void {
    const authRoles = response && response.data && response.data.roles
    if (authRoles && authRoles.length > 0) {
      // set auth roles to store
      store.dispatch(SET_AUTH_ROLES, authRoles)
    } else {
      throw new Error('Invalid auth roles')
    }
  }
}
