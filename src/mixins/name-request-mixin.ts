// Libraries
import axios from '@/utils/axios-auth'
import { Component, Vue } from 'vue-property-decorator'
import { NameRequestStates, EntityTypes } from '@/enums'
import { NameRequestIF } from '@/interfaces'

/**
 * Name request mixin for processing NR responses
 */
@Component
export default class NameRequestMixin extends Vue {
  /**
   * Generate name request state for the store
   * @param nr the name request response payload
   * @param filingId the filing id
   */
  generateNameRequestState (nr: any, filingId: number): NameRequestIF {
    const approvedName = nr.names.filter(name => name.state === NameRequestStates.APPROVED)[0].name
    return {
      nrNumber: nr.nrNum,
      // TODO: Update entityType to use nr.requestTypeCd when namex supports our entity types
      entityType: EntityTypes.BCOMP,
      filingId: filingId,
      applicant: {
        // Address Information
        addressLine1: nr.applicants.addrLine1,
        addressLine2: nr.applicants.addrLine2,
        addressLine3: nr.applicants.addrLine3,
        city: nr.applicants.city,
        countryTypeCode: nr.applicants.countryTypeCd,
        postalCode: nr.applicants.postalCd,
        stateProvinceCode: nr.applicants.stateProvinceCd,

        // Application contact information
        emailAddress: nr.applicants.emailAddress,
        phoneNumber: nr.applicants.phoneNumber,

        // Application name information
        firstName: nr.applicants.firstName,
        middleName: nr.applicants.middleName,
        lastName: nr.applicants.lastName
      },
      details: {
        approvedName: approvedName,
        consentFlag: nr.consentFlag,
        expirationDate: nr.expirationDate,
        status: nr.state
      }
    }
  }
  /**
   * Returns True if the Name Request data is valid.
   * @param nr the name request response payload
   * */
  isNrValid (nr: any): boolean {
    // TODO: implement check for supported entity types when namex supports BCOMP
    return (nr &&
      nr.state &&
      nr.expirationDate &&
      nr.names?.length > 0 &&
      nr.nrNum &&
      nr.requestTypeCd)
  }

  /**
   * Method to check if a name request response payload is consumable
   * @param nr the name request response payload
   */
  isNRConsumable (nr : any) : { isConsumable: boolean, expired: boolean, approved: boolean } {
    // Ensure a name request payload is provided
    if (!nr) {
      throw new Error('isNRConsumable() : no NR provided')
    }
    // Check if NR response has expired
    if (new Date(nr.expirationDate) < new Date()) {
      return { isConsumable: false, expired: true, approved: false }
    }

    // If the NR root state is not APPROVED, this NR is not consumable
    if (nr.state !== NameRequestStates.APPROVED) {
      return { isConsumable: false, expired: false, approved: false }
    }

    // Check if the name request has already been consumed
    let hasBeenConsumed = false
    nr.names.forEach((name: { consumptionDate: any; }) => {
      if (name.consumptionDate) {
        hasBeenConsumed = true
      }
    })
    if (hasBeenConsumed) {
      return { isConsumable: false, expired: false, approved: true }
    }

    return { isConsumable: true, expired: false, approved: true }
  }
}
