// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { NameRequestStates, NameRequestTypes } from '@/enums'
import { NameRequestIF } from '@/interfaces'
import { DateMixin } from '@/mixins'

/**
 * Mixin for processing Name Request objects.
 */
@Component({})
export default class NameRequestMixin extends Mixins(DateMixin) {
  /**
   * Generates Name Request state for the store.
   * @param nr the name request response payload
   * @param filingId the filing id
   */
  generateNameRequestState (nr: any, filingId: number): NameRequestIF {
    return {
      nrNumber: nr.nrNum,
      entityType: nr.legalType,
      filingId,
      applicant: {
        // Address Information
        addressLine1: nr.applicants.addrLine1,
        addressLine2: nr.applicants.addrLine2,
        addressLine3: nr.applicants.addrLine3,
        city: nr.applicants.city,
        countryTypeCode: nr.applicants.countryTypeCd,
        postalCode: nr.applicants.postalCd,
        stateProvinceCode: nr.applicants.stateProvinceCd,

        // Contact information
        emailAddress: nr.applicants.emailAddress,
        phoneNumber: nr.applicants.phoneNumber,

        // Name information
        firstName: nr.applicants.firstName,
        middleName: nr.applicants.middleName,
        lastName: nr.applicants.lastName
      },
      details: {
        approvedName: this.getNrApprovedName(nr) || '',
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
    // check all expected fields
    // FUTURE: add more checks here as needed
    return Boolean(
      nr &&
      nr.nrNum &&
      nr.applicants &&
      nr.state &&
      nr.expirationDate &&
      nr.legalType &&
      (nr.request_action_cd === NameRequestTypes.NEW) &&
      !!this.getNrApprovedName(nr)
    )
  }

  /**
   * Returns the Name Request's state.
   * @param nr the name request response payload
   */
  getNrState (nr: any): NameRequestStates {
    // Ensure a NR payload is provided.
    if (!nr) {
      return null
    }

    // If the NR is awaiting consent, it is not consumable.
    // null = consent not required
    // R = consent received
    // N = consent waived
    if (nr.state === NameRequestStates.CONDITIONAL &&
      nr.consentFlag !== null && nr.consentFlag !== 'R' && nr.consentFlag !== 'N') {
      return NameRequestStates.NEED_CONSENT
    }

    // If the NR's root state is not APPROVED or CONDITIONAL, it is not consumable.
    // EXPIRED or CONSUMED should not return NOT_APPROVED.
    if (![NameRequestStates.APPROVED, NameRequestStates.CONDITIONAL,
      NameRequestStates.EXPIRED, NameRequestStates.CONSUMED].includes(nr.state)) {
      return NameRequestStates.NOT_APPROVED
    }

    // Otherwise, the NR is consumable.
    return nr.state // APPROVED or CONDITIONAL or CONSUMED or EXPIRED
  }

  /**
   * Returns the Name Request's approved name (or undefined or null if not found).
   * @param nr the name request response payload
   */
  getNrApprovedName (nr: any): string {
    if (nr?.names?.length > 0) {
      return nr.names
        .find(name => [NameRequestStates.APPROVED, NameRequestStates.CONDITION].includes(name.state))?.name
    }
    return null // should never happen
  }
}
