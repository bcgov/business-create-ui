<template>
  <div id="name-request-info">
    <template v-if="getNameRequestNumber">
      <!-- Name Request -->
      <div class="section-container mb-n8">
        <v-row
          id="name-request"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
            class="pr-4"
          >
            <label>Name Request</label>
          </v-col>

          <v-col
            cols="12"
            sm="8"
            class="pt-4 pt-sm-0"
          >
            <ul class="name-request-list-items">
              <li id="name-request-title">
                <strong>{{ getNameRequestNumber }}</strong> - {{ getNameRequestApprovedName }}
              </li>
              <li class="mt-4">
                <strong>Entity Type:</strong> {{ getEntityTypeDescription }}
              </li>
              <li><strong>Request Type:</strong> {{ requestType }}</li>
              <li><strong>Expiry Date:</strong> {{ expirationDate }}</li>
              <li><strong>Status:</strong> {{ state }}</li>
              <li
                v-if="isConditional"
                id="condition-consent"
              >
                <strong>Condition/Consent:</strong> {{ conditionConsent }}
              </li>
            </ul>
          </v-col>

          <!-- extra column is for possible action button -->
        </v-row>
      </div>

      <!-- Name Request Applicant -->
      <div class="section-container">
        <v-row
          id="name-request-applicant"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
            class="pr-4"
          >
            <label>Name Request Applicant</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
            class="pt-4 pt-sm-0"
          >
            <ul class="applicant-list-items">
              <li><strong>Name:</strong> {{ formatFullName(applicant) }}</li>
              <li><strong>Address:</strong> {{ formatFullAddress(applicant) }}</li>
              <li><strong>Email:</strong> {{ applicant.emailAddress }}</li>
              <li><strong>Phone:</strong> {{ applicant.phoneNumber }}</li>
            </ul>
          </v-col>
        </v-row>
      </div>
    </template>

    <template v-else-if="getNameRequestApprovedName">
      <!-- Changed Name -->
      <div class="section-container">
        <v-row
          id="changed-name-info"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
            class="pr-4"
          >
            <label>Name</label>
          </v-col>
          <v-col
            id="changed-name-title"
            cols="12"
            sm="9"
          >
            {{ getNameRequestApprovedName }}
          </v-col>
        </v-row>
      </div>
    </template>

    <template v-else>
      <!-- Numbered Company -->
      <div class="section-container">
        <v-row
          id="numbered-company-info"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
            class="pr-4"
          >
            <label>Resulting Business Name</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <ul class="numbered-company-list-items">
              <li id="numbered-company-title">
                <strong>[Incorporation Number]</strong> B.C. LTD.
              </li>
              <li class="bullet-point mt-4 ml-6">
                You will be filing this Incorporation Application for a company
                created by adding "B.C. LTD." after the Incorporation Number.
              </li>
              <li class="bullet-point ml-6">
                Your Incorporation Number will be generated at the end of the filing
                transaction.
              </li>
              <li class="bullet-point ml-6">
                It is not possible to request a specific Incorporation Number.
              </li>
            </ul>
          </v-col>
          <v-col
            cols="12"
            sm="3"
            class="pr-4 mt-4"
          >
            <label>Resulting Business Type</label>
          </v-col>
          <v-col
            cols="12"
            sm="9"
            class="mt-4"
          >
            <ul class="entity-type-description">
              <li>
                {{ getEntityTypeDescription }}
              </li>
            </ul>
          </v-col>
        </v-row>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { NameRequestStates, NrRequestActionCodes } from '@/enums'
import { NrApplicantIF, NameRequestIF } from '@/interfaces'
import { CommonMixin, DateMixin } from '@/mixins'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { Capitalize } from '@/utils'

@Component({})
export default class NameRequestInfo extends Mixins(CommonMixin, DateMixin) {
  // For template
  readonly NameRequestStates = NameRequestStates

  readonly RECEIVED_STATE = 'Received'
  readonly NOT_RECEIVED_STATE = 'Not Received'
  readonly NOT_REQUIRED_STATE = 'Not Required'
  readonly WAIVED_STATE = 'Waived'

  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getNameRequest!: NameRequestIF
  @Getter(useStore) getNameRequestApprovedName!: string
  @Getter(useStore) getNameRequestNumber!: string
  @Getter(useStore) isTypeSoleProp: boolean

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
    switch (this.getNameRequest.request_action_cd) {
      case NrRequestActionCodes.NEW_BUSINESS: return 'New Business'
      case NrRequestActionCodes.RESTORE: return 'Restoration Request'
    }
    return '' // should never happen
  }

  get isConditional (): boolean {
    return (this.getNameRequest.state === NameRequestStates.CONDITIONAL)
  }

  /** The expiration date. */
  get expirationDate (): string {
    return this.apiToPacificDateTime(this.getNameRequest.expirationDate)
  }

  /** The state. */
  get state (): string {
    const state = this.getNameRequest.state?.toString().split('_').join(' ')
    return Capitalize(state || '')
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
  get applicant (): NrApplicantIF {
    return this.getNameRequest.applicants // object not array
  }
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

#changed-name-title {
  font-size: $px-22;
  font-weight: bold;
  color: $gray9;
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
