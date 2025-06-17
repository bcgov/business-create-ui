import { initialize, LDClient, LDFlagSet, LDOptions, LDUser } from 'launchdarkly-js-client-sdk'

// get rid of "element implicitly has an 'any' type..."
declare const window: any

/**
 * Default flag values when LD is not available.
 * Uses "business-create" project (per LD client id in config).
 */
const defaultFlagSet: LDFlagSet = {
  'supported-filings': [],
  'enable-legal-name-fix': false, // by default, the easy legal name changes are disabled
  'enable-web-chat': false, // by default, old webchat is disabled
  'enable-genesys-web-message': false, // by default, genesys web message is disabled
  'sentry-enable': false, // by default, no sentry logs
  'banner-text': '', // by default, there is no banner text
  'use-business-api-gw-url': false // by default, use Legal API URL instead of Business API GW URL
}

/**
 * The Launch Darkly client instance.
 */
let ldClient = null as LDClient

/**
 * An async method that initializes the Launch Darkly client.
 */
export async function InitLdClient (): Promise<void> {
  const envKey: string = window.ldClientId

  if (envKey) {
    const user: LDUser = {
      // since we have no user data yet, use a shared key temporarily
      key: 'anonymous'
    }
    const options: LDOptions = {
      // fetch flags using REPORT request (to see user data as JSON)
      useReport: true,
      // opt out of sending diagnostics data
      diagnosticOptOut: true,
      // open streaming connection for live flag updates
      streaming: true
    }

    ldClient = initialize(envKey, user, options)

    try {
      await ldClient.waitForInitialization()
    } catch {
      // shut down client -- `variation()` will return undefined values
      await ldClient.close()
      // NB: LD logs its own errors
    }
  }
}

/**
 * An async method that updates the Launch Darkly user properties.
 * @param key a unique string identifying a user
 * @param email the user's email address
 * @param firstName the user's first name
 * @param lastName the user's last name
 * @param custom optional object of additional attributes associated with the user
 */
export async function UpdateLdUser (
  key: string, email: string, firstName: string, lastName: string, custom = null
): Promise<void> {
  if (ldClient) {
    const user: LDUser = { key, email, firstName, lastName, custom }
    try {
      await ldClient.identify(user)
    } catch {
      // NB: LD logs its own errors
    }
  }
}

/**
 * A method that gets the value of the specified feature flag.
 * @param name the name of the feature flag
 * @returns the flag value/variation, or undefined if the flag is not found
 */
export function GetFeatureFlag (name: string): any {
  return ldClient ? ldClient.variation(name) : defaultFlagSet[name]
}
