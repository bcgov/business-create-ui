<template>
  <v-card flat id="resolution-summary" class="mt-10">
    <header class="review-header rounded-t">
      <v-icon class="ml-2" color="appDkBlue">mdi-handshake</v-icon>
      <label class="font-weight-bold pl-2">{{getCreateResolutionResource.reviewConfirmHeader}}</label>
    </header>
    <section v-if="isBaseCompany && this.getCreateResolutionStep.validationDetail.valid"
             class="section-container upload-success-message"
    >
      <v-row no-gutters>
        <v-col md="auto" class="mr-3">
          <v-icon class="upload-success-chk" color="successCheckmark">mdi-check</v-icon>
        </v-col>
        <v-col md="11" id="file-name-col">
          <span>The resolution was completed and deposited in the Company's records book.</span>
        </v-col>
      </v-row>
    </section>

    <section v-if="allResolutionValidationItemsInvalid"
             class="section-container invalid-section rounded-bl-0"
    >
        <v-icon color="error">mdi-information-outline</v-icon>
        <span class="error-text ml-1 mr-2">This step is unfinished.</span>
        <router-link
          :to="{ path: `/${RouteNames.CREATE_RESOLUTION}` }"
        >Return to this step to finish it</router-link>
    </section>

    <section id="resolution-summary-section-3"
             v-if="isTypeCoop && !allResolutionValidationItemsInvalid"
             class="section-container rounded-bl-0"
             :class="{ 'invalid-section': !getCreateResolutionStep.validationDetail.valid }"
    >
        <v-container v-if="!getCreateResolutionStep.validationDetail.valid" class="pl-0 pb-5">
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text ml-1 mr-2">This step is unfinished.</span>
          <router-link
            :to="{ path: `/${RouteNames.CREATE_RESOLUTION}` }"
          >Return to this step to finish it</router-link>
        </v-container>
      <v-row class="ml-1 mt-3" no-gutters>
        <v-col md="3">
          <strong>Resolution Date</strong>
        </v-col>
        <v-col md="9" class="ml-n1">
          {{resolutionDate}}
        </v-col>
      </v-row>
      <v-row class="ml-1 mt-5" no-gutters>
        <v-col md="3">
          <strong>Resolution Text</strong>
        </v-col>
        <v-col md="9" class="ml-n1">
          <v-lazy>
            <v-textarea
              id="resolution-text"
              rows="1"
              auto-grow
              readonly
              filled
              background-color="white"
              v-model="resolutionText">
            </v-textarea>
          </v-lazy>
        </v-col>
      </v-row>
      <v-row class="ml-1 mt-3" no-gutters>
        <v-col md="3">
          <strong>Signing Party</strong>
        </v-col>
        <v-col md="9" class="ml-n1">
          {{signingParty}}
        </v-col>
      </v-row>
      <v-row class="ml-1 mt-5" no-gutters>
        <v-col md="3">
          <strong>Date Signed</strong>
        </v-col>
        <v-col md="9" class="ml-n1">
          {{signingDate}}
        </v-col>
      </v-row>
      <v-row v-if="getCreateResolutionStep.resolutionConfirmed" class="ml-1 mt-5" no-gutters>
        <v-col md="auto" class="mr-2">
          <v-icon class="upload-success-chk" color="successCheckmark">mdi-check</v-icon>
        </v-col>
        <v-col md="11" id="file-name-col">
          <span>{{ getCreateResolutionResource.confirmSection.reviewSummaryText }}</span>
        </v-col>
      </v-row>
    </section>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { DateMixin } from '@/mixins'

// Enums
import { RouteNames } from '@/enums'
import { CreateResolutionIF, CreateResolutionResourceIF } from '@/interfaces'

@Component({})
export default class CompleteResolutionSummary extends Mixins(DateMixin) {
  @Getter getCreateResolutionStep!: CreateResolutionIF
  @Getter getCreateResolutionResource!: CreateResolutionResourceIF
  @Getter isBaseCompany!: boolean
  @Getter isTypeCoop!: boolean

  // Enum for template
  readonly RouteNames = RouteNames

  get resolutionDate (): string {
    const resolutionDate = this.getCreateResolutionStep.resolutionDate
    if (resolutionDate) {
      return this.yyyyMmDdToPacificDate(resolutionDate, true)
    }
    return '(Not Entered)'
  }

  get resolutionText (): string {
    const resolutionText = this.getCreateResolutionStep.resolutionText
    if (resolutionText) {
      return resolutionText
    }
    return '(Not Entered)'
  }

  get signingParty (): string {
    const signingParty = this.getCreateResolutionStep.signingPerson
    if (signingParty.givenName && signingParty.familyName) {
      const fullName = `${signingParty.givenName.trim()}
                        ${signingParty.additionalName.trim()}
                        ${signingParty.familyName.trim()}`
      return fullName
    }
    return '(Not Entered)'
  }

  get signingDate (): string {
    const signingDate = this.getCreateResolutionStep.signingDate
    if (signingDate) {
      return this.yyyyMmDdToPacificDate(signingDate, true)
    }
    return '(Not Entered)'
  }

  /** Is true when all validation items are invalid. */
  get allResolutionValidationItemsInvalid (): boolean {
    const validationItemsDetails = this.getCreateResolutionStep.validationDetail.validationItemDetails
    const invalidValidationItems = validationItemsDetails.filter(item => item.valid === false)
    const result = validationItemsDetails.length === invalidValidationItems.length
    return result
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// styles specific to resolution summary section
#resolution-summary-section-3 {
  // removes dotted line bottom border on text area
  ::v-deep .v-text-field.v-input--is-readonly .v-input__slot:before {
    border-style: None !important;
  }

  // remove text area padding
  ::v-deep .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control >
  .v-input__slot, .v-text-field.v-text-field--enclosed .v-text-field__details {
    padding: 0px !important;
  }

  #resolution-text {
    margin-top: 0px !important;
  }

  .section-container {
    padding-bottom: 2rem !important;
  }
}

</style>
