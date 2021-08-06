// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { CorpTypeCd, NameRequestStates, NameRequestTypes } from '@/enums'
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
      entityType: this.nrTypeToEntityType(nr),
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

        // Contact information
        emailAddress: nr.applicants.emailAddress,
        phoneNumber: nr.applicants.phoneNumber,

        // Name information
        firstName: nr.applicants.firstName,
        middleName: nr.applicants.middleName,
        lastName: nr.applicants.lastName
      },
      details: {
        approvedName: this._getApprovedName(nr),
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
      nr.names?.length > 0 &&
      this.nrTypeToEntityType(nr) &&
      this._getApprovedName(nr)
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

    // If the NR is expired, it is not consumable.
    const expireDays = this.daysFromToday(nr.expirationDate)
    if (isNaN(expireDays) || expireDays < 1) {
      return NameRequestStates.EXPIRED
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
    if (nr.state !== NameRequestStates.APPROVED && nr.state !== NameRequestStates.CONDITIONAL) {
      return NameRequestStates.NOT_APPROVED
    }

    // If the NR has already been consumed, it is not consumable.
    if (nr.names.some(name => name.consumptionDate)) {
      return NameRequestStates.CONSUMED
    }

    // Otherwise, the NR is consumable.
    return nr.state // APPROVED or CONDITIONAL
  }

  /**
   * Returns the Name Request's approved name.
   * @param nr the name request response payload
   */
  private _getApprovedName (nr: any): string {
    if (nr.state === NameRequestStates.APPROVED) {
      return nr.names.find(name => name.state === NameRequestStates.APPROVED).name
    }
    if (nr.state === NameRequestStates.CONDITIONAL) {
      return nr.names.find(name => name.state === NameRequestStates.CONDITION).name
    }
    return null // should never happen
  }

  /**
   * Returns the entity (corp) type that corresponds to the NR type.
   * @param nr the name request response payload
   */
  nrTypeToEntityType (nr: any): CorpTypeCd {
    switch (nr.entity_type_cd) {
      case NameRequestTypes.BC: return CorpTypeCd.BENEFIT_COMPANY
      case NameRequestTypes.CR: return CorpTypeCd.BC_CORPORATION
      case NameRequestTypes.UL: return CorpTypeCd.BC_UNLIMITED
      case NameRequestTypes.CC: return CorpTypeCd.BC_CCC
      case NameRequestTypes.CP: return CorpTypeCd.COOP
    }
    return null // unknown entity type code
  }
}
