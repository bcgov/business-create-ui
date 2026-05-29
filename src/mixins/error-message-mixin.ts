import { Component, Vue } from 'vue-property-decorator'

/**
 * Mixin that provides an error message decoding utility.
 */
@Component({})
export default class ErrorMessageMixin extends Vue {
  /**
   * Mapping from path to user-friendly description.
   * We only need to identify parent object since error message identifies the invalid property.
   * FUTURE: handle "nth" nameTranslation, parties, shareClasses and series items
   * FUTURE: identify party by name (from filing)
   * FUTURE: identify share class/series by name (from filing)
   */
  static errorMessages = {
    filing: {
      business: {
        identifier: 'Error in business object',
        legalType: 'Error in business object'
      },
      header: {
        certifiedBy: 'Error in header object',
        date: 'Error in header object',
        filingId: 'Error in header object',
        isFutureEffective: 'Error in header object',
        name: 'Error in header object',
        priority: 'Error in header object',
        waiveFees: 'Error in header object'
      },
      incorporationApplication: {
        contactPoint: {
          email: 'Error in contact point',
          phone: 'Error in contact point'
        },
        incorporationAgreement: {
          agreementType: 'Error in incorporation agreement'
        },
        nameRequest: {
          legalType: 'Error in name request'
        },
        nameTranslations: [
          {
            name: 'Error in name translation'
          }
        ],
        offices: {
          recordsOffice: {
            deliveryAddress: {
              addressCity: 'Error in records office delivery address',
              addressCountry: 'Error in records office delivery address',
              addressRegion: 'Error in records office delivery address',
              postalCode: 'Error in records office delivery address',
              streetAddress: 'Error in records office delivery address',
              streetAddressAdditional: 'Error in records office delivery address'
            },
            mailingAddress: {
              addressCity: 'Error in records office mailing address',
              addressCountry: 'Error in records office mailing address',
              addressRegion: 'Error in records office mailing address',
              postalCode: 'Error in records office mailing address',
              streetAddress: 'Error in records office mailing address',
              streetAddressAdditional: 'Error in records office mailing address'
            }
          },
          registeredOffice: {
            deliveryAddress: {
              addressCity: 'Error in registered office delivery address',
              addressCountry: 'Error in registered office delivery address',
              addressRegion: 'Error in registered office delivery address',
              postalCode: 'Error in registered office delivery address',
              streetAddress: 'Error in registered office delivery address',
              streetAddressAdditional: 'Error in registered office delivery address'
            },
            mailingAddress: {
              addressCity: 'Error in registered office mailing address',
              addressCountry: 'Error in registered office mailing address',
              addressRegion: 'Error in registered office mailing address',
              postalCode: 'Error in registered office mailing address',
              streetAddress: 'Error in registered office mailing address',
              streetAddressAdditional: 'Error in registered office mailing address'
            }
          }
        },
        parties: [
          {
            deliveryAddress: {
              addressCity: 'Error in party delivery address',
              addressCountry: 'Error in party delivery address',
              addressRegion: 'Error in party delivery address',
              postalCode: 'Error in party delivery address',
              streetAddress: 'Error in party delivery address',
              streetAddressAdditional: 'Error in party delivery address'
            },
            mailingAddress: {
              addressCity: 'Error in party mailing address',
              addressCountry: 'Error in party mailing address',
              addressRegion: 'Error in party mailing address',
              postalCode: 'Error in party mailing address',
              streetAddress: 'Error in party mailing address',
              streetAddressAdditional: 'Error in party mailing address'
            },
            officer: {
              email: 'Error in party officer',
              firstName: 'Error in party officer',
              lastName: 'Error in party officer',
              middleName: 'Error in party officer',
              organizationName: 'Error in party officer',
              partyType: 'Error in party officer'
            },
            roles: {
              appointmentDate: 'Error in party roles',
              cessationDate: 'Error in party roles',
              roleType: 'Error in party roles'
            }
          }
        ],
        shareStructure: {
          shareClasses: [
            {
              currency: 'Error in share class currency',
              hasMaximumShares: 'Error in share class has maximum shares',
              hasParValue: 'Error in share class has par value',
              hasRightsOrRestrictions: 'Error in share class has rights or restrictions',
              maxNumberOfShares: 'Error in share class maximum number of shares',
              name: 'Error in share class name',
              parValue: 'Error in share class par value',
              priority: 'Error in share class priority',
              series: [{
                currency: 'Error in share series currency',
                hasMaximumShares: 'Error in share series has maximum shares',
                hasParValue: 'Error in share series has par value',
                hasRightsOrRestrictions: 'Error in share series has rights or restrictions',
                maxNumberOfShares: 'Error in share series maximum number of shares',
                name: 'Error in share series name',
                parValue: 'Error in share series par value',
                priority: 'Error in share series priority',
                type: 'Error in share series type'
              }],
              type: 'Error in share class type'
            }
          ]
        }
      }
    }
  }

  /**
   * Gets error message using a string path.
   * Returns undefined if any part of the path is not found.
   */
  static getByPath (path: string): any {
    return path
      .replace(/\[(\w+)\]/g, '.$1') // convert [0] → .0
      .split('.')
      .reduce((o, key) => (o ? o[key] : undefined), ErrorMessageMixin.errorMessages)
  }

  /**
   * Given an error object (in an error response from the API), returns a user-friendly description.
   * @param err - an element from the errors array from the API response
   * @param filing - the filing object from the API response (FOR FUTURE USE)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  decodeErrorMessage (err: any, filing: any): string {
    // context object means schema error
    // decode first context only
    if (err.context?.[0]) {
      // remove leading "$." if present
      const path = err.context[0].jsonPath?.startsWith('$.')
        ? err.context[0].jsonPath.slice(2)
        : err.context[0].jsonPath

      const message = ErrorMessageMixin.getByPath(path)

      if (typeof message !== 'string') {
        return `Error at ${path}: ${err.context[0].message}`
      } else {
        return `${message}: ${err.context[0].message}`
      }
    }

    // remove leading slash if present
    let path = err.path?.startsWith('/') ? err.path.slice(1) : err.path

    // convert "filing/incorporationApplication/parties/0/mailingAddress/addressCity"
    // to "filing.incorporationApplication.parties[0].mailingAddress.addressCity"
    path = path?.replace(/\/(\d+)(?=\/|$)/g, '[$1]').replace(/\//g, '.')

    const message = ErrorMessageMixin.getByPath(path)

    if (typeof message !== 'string') {
      return `Error at ${path}: ${err.error}`
    } else {
      return `${message}: ${err.error}`
    }
  }
}
