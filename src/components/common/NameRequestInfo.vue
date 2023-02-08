<template>
  <div id="name-request-info">
    <template v-if="getNameRequestNumber">
      <div class="section-container">
        <!-- Name Request -->
        <v-row no-gutters id="name-request">
          <v-col cols="12" sm="3" class="pr-4">
            <label>
              <strong>Name Request</strong>
            </label>
          </v-col>

          <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
            <ul class="name-request-list-items">
              <li id="name-request-title">
                <strong>{{ getNameRequestNumber }}</strong> - {{ getNameRequestApprovedName }}
              </li>
              <li class="mt-4"><strong>Entity Type:</strong> {{ getEntityTypeDescription }}</li>
              <li><strong>Request Type:</strong> {{ requestType }}</li>
              <li><strong>Expiry Date:</strong> {{ expirationDate }}</li>
              <li><strong>Status:</strong> {{ Capitalize(state) }}</li>
              <li id="condition-consent" v-if="state === NameRequestStates.CONDITIONAL">
                <strong>Condition/Consent:</strong> {{ conditionConsent }}
              </li>
            </ul>
          </v-col>
        </v-row>
      </div>

      <!-- Name Request Applicant -->
      <div class="section-container">
        <v-row no-gutters id="name-request-applicant">
          <v-col cols="12" sm="3" class="pr-4">
            <label>
              <strong>Name Request Applicant</strong>
            </label>
          </v-col>

          <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
            <ul class="applicant-list-items">
              <li><strong>Name:</strong> {{ applicantName }}</li>
              <li><strong>Address:</strong> {{ applicantAddress }}</li>
              <li><strong>Email:</strong> {{ emailAddress }}</li>
              <li><strong>Phone:</strong> {{ phoneNumber }}</li>
            </ul>
          </v-col>
        </v-row>
      </div>
    </template>

    <!-- Name -->
    <template v-else>
      <div class="section-container">
        <v-row
          no-gutters
          id="numbered-company-info"
        >
          <v-col cols="12" sm="3" class="pr-4">
            <label>
              <strong>Name</strong>
            </label>
          </v-col>

          <v-col cols="12" sm="9">
            <ul class="numbered-company-list-items">
              <li id="numbered-company-title">
                <strong>[Incorporation Number]</strong> B.C. Ltd.
              </li>
              <li class="mt-4"><strong>Entity Type:</strong> {{ getEntityTypeDescription }}</li>
              <li class="mt-2"><strong>Request Type:</strong> {{ requestType }}</li>
              <li class="bullet-point mt-4 ml-6">You will be filing this Incorporation Application for a company
                created by adding "B.C. Ltd." after the Incorporation Number.
              </li>
              <li class="bullet-point ml-6">Your Incorporation Number will be generated at the end of the filing
                transaction.
              </li>
              <li class="bullet-point ml-6">It is not possible to request a specific Incorporation Number.</li>
            </ul>
          </v-col>
        </v-row>
      </div>
    </template>

    <!-- Name Translation -->
    <NameTranslation
      v-if="showNameTranslation"
      @hasNameTranslation="emitHasNameTranslation($event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { getName } from 'country-list'
import NameTranslation from '@/components/common/NameTranslation.vue'
import { CorpTypeCd, NameRequestStates } from '@/enums'
import {
  NameRequestApplicantIF,
  NameRequestIFRegistrationStateIF
} from '@/interfaces'
import { DateMixin } from '@/mixins'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { Capitalize } from '@/utils'

@Component({
  components: {
    NameTranslation
  },
  mixins: [
    DateMixin
  ]
})
export default class NameRequestInfo extends Vue {
  // For template
  readonly NameRequestStates = NameRequestStates
  readonly Capitalize = Capitalize

  readonly RECEIVED_STATE = 'Received'
  readonly NOT_RECEIVED_STATE = 'Not Received'
  readonly NOT_REQUIRED_STATE = 'Not Required'
  readonly WAIVED_STATE = 'Waived'

  @Getter getEntityType!: CorpTypeCd
  @Getter getNameRequest!: NameRequestIF
  @Getter getNameRequestNumber!: string
  @Getter getNameRequestApprovedName!: string
  @Getter isTypeCoop: boolean
  @Getter isTypeSoleProp: boolean
  @Getter isTypePartnership: boolean

  /** The entity type description.  */
  get getEntityTypeDescription (): string {
    const corpTypeDescription = GetCorpFullDescription(this.getEntityType)
    if (this.isTypeSoleProp) {
      return `${corpTypeDescription} or Doing Business As (DBA)`
    }
    return corpTypeDescription
  }

  /** The request type. */
  get requestType (): string {
    return 'New Business'
  }

  /** The expiration date. */
  get expirationDate (): string {
    return this.apiToPacificDateTime(this.getNameRequest.expirationDate, true)
  }

  /** The state. */
  get state (): NameRequestStates {
    if (this.getNameRequest.state === NameRequestStates.APPROVED) {
      return 'Approved'
    }
    return this.getNameRequest.state?.toString() || null
  }

  /** The condition/consent string. */
  get conditionConsent (): string {
    const consentFlag = this.getNameRequest.consentFlag
    if (this.getNameRequest.state === NameRequestStates.APPROVED) {
      return this.NOT_REQUIRED_STATE
    }
    if (consentFlag === null) {
      return this.NOT_REQUIRED_STATE
    }
    if (consentFlag === 'R') {
      return this.RECEIVED_STATE
    }
    if (consentFlag === 'N') {
      return this.WAIVED_STATE
    }
    return this.NOT_RECEIVED_STATE
  }

  /** The applicant. */
  get applicant (): NameRequestApplicantIF {
    return this.getNameRequest.applicants // not an array
  }

  /** The applicant's name. */
  get applicantName (): string {
    let name = this.applicant.firstName
    if (this.applicant.middleName) {
      name = `${name} ${this.applicant.middleName} ${this.applicant.lastName}`
    } else {
      name = `${name} ${this.applicant.lastName}`
    }
    return name
  }

  /** The applicant's address. */
  get applicantAddress (): string {
    const city = this.applicant.city
    const stateProvince = this.applicant.stateProvinceCd
    const postal = this.applicant.postalCd
    const country = this.applicant.countryTypeCd ? getName(this.applicant.countryTypeCd) : ''

    // Build address lines
    let address = this.applicant.addrLine1
    if (this.applicant.addrLine2) {
      address = `${address}, ${this.applicant.addrLine2}`
    }
    if (this.applicant.addrLine3) {
      address = `${address}, ${this.applicant.addrLine3}`
    }

    return `${address}, ${city}, ${stateProvince}, ${postal}, ${country}`
  }

  /** The applicant's email address. */
  get emailAddress (): string {
    return this.applicant.emailAddress
  }

  /** The applicant's phone number. */
  get phoneNumber (): string {
    return this.applicant.phoneNumber
  }

  /** Whether to show the name translation component. */
  get showNameTranslation (): boolean {
    if (this.isTypeCoop || this.isTypeSoleProp || this.isTypePartnership) return false
    return true
  }

  @Emit('hasNameTranslation')
  protected emitHasNameTranslation (val: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

ul {
  font-size: $px-15;
  margin: 0;
  padding: 0;
  list-style-type: none;

  li:not(:first-child) {
    margin-top: 8px;
  }
}

#name-request-title,
#numbered-company-title {
  font-size: $px-20;
}

.numbered-company-list-items {
  .bullet-point::before {
    content: "\2022";
    display: inline-block;
    width: 1.5em;
    margin-left: -1.5em;
  }
}
</style>
