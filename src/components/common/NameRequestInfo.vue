<template>
  <div id="name-request-summary">
    <template v-if="getNameRequestNumber">
      <v-row id="name-request-info">
        <v-col>
          <label>
            <strong>Name Request</strong>
          </label>
        </v-col>
        <v-col>
          <ul class="name-request-list-items">
            <li class="name-request-title">
              <strong>{{ getNameRequestNumber }}</strong> - {{ getNameRequestDetails.approvedName }}
            </li>
            <li class="mt-4"><strong>Entity Type:</strong> {{ entityTypeDescription() }}</li>
            <li><strong>Request Type:</strong> {{ requestType() }}</li>
            <li class="mt-4"><strong>Expiry Date:</strong> {{ formattedExpirationDate() }}</li>
            <li><strong>Status:</strong> {{ getNameRequestDetails.status }}</li>
            <li id="condition-consent" v-if="getNameRequestDetails.status === NameRequestStates.CONDITIONAL">
              <strong>Condition/Consent:</strong> {{ conditionConsent() }}
            </li>
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
            <li><strong>Name:</strong> {{ applicantName() }}</li>
            <li><strong>Address:</strong> {{ applicantAddress() }}</li>
            <li><strong>Email:</strong> {{ getNameRequestApplicant.emailAddress }}</li>
            <li><strong>Phone:</strong> {{ getNameRequestApplicant.phoneNumber }}</li>
          </ul>
        </v-col>
      </v-row>
    </template>
    <v-row v-else id="numbered-company-info">
      <v-col>
        <label>
          <strong>Name</strong>
        </label>
      </v-col>
      <v-col>
        <ul class="numbered-company-list-items">
          <li class="numbered-company-title">
            <strong>[Incorporation Number]</strong> B.C. Ltd.
          </li>
          <li class="mt-4"><strong>Entity Type:</strong> {{ entityTypeDescription() }}</li>
          <li><strong>Request Type:</strong> {{ requestType() }}</li>
          <li class="bullet-point mt-4 ml-5">
            You will be filing this Incorporation Application for a company created by adding "B.C. Ltd." after the
            Incorporation Number.
          </li>
          <li class="bullet-point ml-5">
            Your Incorporation Number will be generated at the end of the filing transaction.
          </li>
          <li class="bullet-point ml-5">It is not possible to request a specific Incorporation Number.</li>
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

@Component({})
export default class NameRequestInfo extends Mixins(DateMixin) {
  // Template Enums
  readonly NameRequestStates = NameRequestStates

  // Global getters
  @Getter isEntityType!: GetterIF;
  @Getter isTypeBcomp!: GetterIF;
  @Getter isTypeCoop!: GetterIF;
  @Getter getTempId!: GetterIF;
  @Getter getNameRequestNumber!: GetterIF;
  @Getter getNameRequestDetails!: NameRequestDetailsIF;
  @Getter getNameRequestApplicant!: NameRequestApplicantIF;

  /** The entity title  */
  private entityTypeDescription (): string {
    if (this.isTypeBcomp) {
      return 'BC Benefit Company'
    } else if (this.isTypeCoop) {
      return 'BC Cooperative Association'
    }

    return ''
  }

  /** The request type */
  private requestType (): string {
    return 'New Business'
  }

  /** Return formatted expiration date */
  private formattedExpirationDate (): string {
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
  private applicantName (): string {
    let name = this.getNameRequestApplicant.firstName
    if (this.getNameRequestApplicant.middleName) {
      name = `${name} ${this.getNameRequestApplicant.middleName} ${this.getNameRequestApplicant.lastName}`
    } else {
      name = `${name} ${this.getNameRequestApplicant.lastName}`
    }
    return name
  }

  /** Return formatted address string */
  private applicantAddress (): string {
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
.row .col:first-child {
  width: 12rem;
  max-width: 12rem;
}

ul {
  font-size: .875rem;
  margin: 0;
  padding: 0;
  list-style-type: none;
}

li.name-request-title, li.numbered-company-title {
  font-size: 1.25rem;
}

ul.numbered-company-list-items {

  .bullet-point::before {
    content: "\2022";
    display: inline-block;
    width: 1.5em;
    margin-left: -1.5em;
  }
}
</style>
