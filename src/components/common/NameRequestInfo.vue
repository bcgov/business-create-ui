<template>
  <div id="name-request-summary">
    <v-row id="name-request-info">
      <v-col>
        <label>
          <strong>Name Request</strong>
        </label>
      </v-col>
      <v-col>
        <ul>
          <li class="name-request-title">
            <strong>{{ getBusinessIdentifier }}</strong> - {{ getNameRequestDetails.approvedName}}
          </li>
          <li class="mt-4">Entity Type: {{ entityTypeDescription() }}</li>
          <li> Request Type: {{ requestType() }}</li>
          <li class="mt-4">Expiry Date: {{ formattedExpirationDate() }}</li>
          <li>Status: {{ getNameRequestDetails.status }}</li>
          <li>Condition/Consent: {{ conditionConsent() }}</li>
        </ul>
      </v-col>
    </v-row>
    <v-row id="name-request-applicant-info">
      <v-col>
        <label>
          <strong>Name Request Applicant</strong>
        </label>
      </v-col>
      <v-col>
        <ul>
          <li>Name: {{ applicantName() }}</li>
          <li>Address: {{ applicantAddress() }}</li>
          <li>Email: {{ getNameRequestApplicant.emailAddress }}</li>
          <li>Phone: {{ getNameRequestApplicant.phoneNumber }}</li>
        </ul>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { getName } from 'country-list'

// Enums
import { NameRequestStates } from '@/enums'

// Interfaces
import { GetterIF, NameRequestDetailsIF, NameRequestApplicantIF } from '@/interfaces'

// Mixins
import { DateMixin } from '@/mixins'

@Component
export default class NameRequestInfo extends Mixins(DateMixin) {
  // Global getters
  @Getter isEntityType!: GetterIF;
  @Getter isTypeBcomp!: GetterIF;
  @Getter isTypeCoop!: GetterIF;
  @Getter getBusinessIdentifier!: GetterIF;
  @Getter getNameRequestDetails!: NameRequestDetailsIF;
  @Getter getNameRequestApplicant!: NameRequestApplicantIF;

  /** The entity title  */
  private entityTypeDescription () :string {
    if (this.isTypeBcomp) {
      return 'BC Benefit Company'
    } else if (this.isTypeCoop) {
      return 'BC Cooperative Association'
    }

    return ''
  }

  /** The request type */
  private requestType () : string {
    return 'New Business'
  }

  /** Return formatted expiration date */
  private formattedExpirationDate () : string {
    return this.toReadableDate(this.getNameRequestDetails.expirationDate)
  }

  /** Return consent received string by checking if conditional and if consent has been received */
  private conditionConsent (): string {
    if (this.getNameRequestDetails.status === NameRequestStates.CONDITIONAL) {
      return this.getNameRequestDetails.consentFlag === 'R' ? 'Received' : 'Not Received'
    }

    return ''
  }

  /** Return formatted applicant name */
  private applicantName () : string {
    let name = this.getNameRequestApplicant.firstName
    if (this.getNameRequestApplicant.middleName) {
      name = `${name} ${this.getNameRequestApplicant.middleName} ${this.getNameRequestApplicant.lastName}`
    } else {
      name = `${name} ${this.getNameRequestApplicant.lastName}`
    }
    return name
  }

  /** Return formatted address string */
  private applicantAddress () : string {
    // Get Address info
    const city = this.getNameRequestApplicant.city
    const stateProvince = this.getNameRequestApplicant.stateProvinceCode
    const postal = this.getNameRequestApplicant.postalCode
    const country = this.getNameRequestApplicant.countryTypeCode
      ? getName(this.getNameRequestApplicant.countryTypeCode) : ''

    // Build address lines
    let address = this.getNameRequestApplicant.addressLine1
    if (this.getNameRequestApplicant.addressLine2) {
      address = `${address}, ${this.getNameRequestApplicant.addressLine2}`
    }
    if (this.getNameRequestApplicant.addressLine3) {
      address = `${address}, ${this.getNameRequestApplicant.addressLine3}`
    }

    return `${address}, ${city}, ${stateProvince}, ${postal}, ${country}`
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/theme.scss";
  .row .col:first-child {
      width: 12rem;
      max-width: 12rem;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  li.name-request-title {
    font-size: 1.25rem;
  }
</style>
