<template>
  <div>
    <section v-if="isBaseCompany && getCreateResolutionStep.validationDetail.valid"
      class="section-container upload-success-message"
    >
      <v-row no-gutters>
        <v-col cols="1">
          <v-icon color="successCheckmark">mdi-check</v-icon>
        </v-col>
        <v-col cols="11" id="file-name-col">
          <span>The resolution was completed and deposited in the Company's records book.</span>
        </v-col>
      </v-row>
    </section>

    <section v-if="allResolutionValidationItemsInvalid"
      class="section-container invalid-section"
    >
      <v-icon color="error">mdi-information-outline</v-icon>
      <span class="error-text mx-1">This step is unfinished.</span>
      <router-link
        :to="{ path: `/${RouteNames.DISSOLUTION_RESOLUTION}` }"
      >Return to this step to finish it</router-link>
    </section>

    <section v-if="isTypeCoop && !allResolutionValidationItemsInvalid"
      id="resolution-summary-section-3"
      class="section-container"
      :class="{ 'invalid-section': !getCreateResolutionStep.validationDetail.valid }"
    >
      <div v-if="!getCreateResolutionStep.validationDetail.valid" class="pb-6">
        <v-icon color="error">mdi-information-outline</v-icon>
        <span class="error-text mx-1">This step is unfinished.</span>
        <router-link
          :to="{ path: `/${RouteNames.DISSOLUTION_RESOLUTION}` }"
        >Return to this step to finish it</router-link>
      </div>

      <v-row no-gutters>
        <v-col cols="12" sm="3" class="pr-4">
          <label class="font-weight-bold">Resolution Date</label>
        </v-col>
        <v-col cols="12" sm="9">
          {{resolutionDate}}
        </v-col>
      </v-row>

      <v-row class="mt-5" no-gutters>
        <v-col cols="12" sm="3" class="pr-4">
          <label class="font-weight-bold">Resolution Text</label>
        </v-col>
        <v-col cols="12" sm="9">
          <v-textarea
            ref="resolutionTextRef"
            id="resolution-text"
            rows="1"
            auto-grow
            readonly
            filled
            hide-details
            background-color="white"
            v-model="resolutionText"
            v-observe-visibility="{ callback: onResolutionVisibilityChanged }"
          />
        </v-col>
      </v-row>

      <v-row class="mt-3" no-gutters>
        <v-col cols="12" sm="3" class="pr-4">
          <label class="font-weight-bold">Signing Party</label>
        </v-col>
        <v-col cols="12" sm="9">
          {{signingParty}}
        </v-col>
      </v-row>

      <v-row class="mt-5" no-gutters>
        <v-col cols="12" sm="3" class="pr-4">
          <label class="font-weight-bold">Date Signed</label>
        </v-col>
        <v-col cols="12" sm="9">
          {{signingDate}}
        </v-col>
      </v-row>

      <v-row v-if="getCreateResolutionStep.resolutionConfirmed" class="mt-5" no-gutters>
        <v-col cols="1">
          <v-icon color="successCheckmark">mdi-check</v-icon>
        </v-col>
        <v-col cols="11" id="file-name-col">
          <span>{{ getCreateResolutionResource.confirmSection.reviewSummaryText }}</span>
        </v-col>
      </v-row>
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { DateMixin } from '@/mixins'

// Enums
import { RouteNames } from '@/enums'
import { CreateResolutionIF, CreateResolutionResourceIF, FormIF } from '@/interfaces'

@Component({})
export default class CompleteResolutionSummary extends Mixins(DateMixin) {
  // Refs
  $refs!: {
    resolutionTextRef: FormIF
  }

  // initialize to true so resolution text height will right height on initial load
  private resolutionTextHeightUpdateRequired = true

  @Getter(useStore) getCreateResolutionResource!: CreateResolutionResourceIF
  @Getter(useStore) getCreateResolutionStep!: CreateResolutionIF
  @Getter(useStore) isBaseCompany!: boolean
  @Getter(useStore) isTypeCoop!: boolean

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

  @Watch('resolutionText')
  private onResolutionTextChanged (): void {
    this.resolutionTextHeightUpdateRequired = true
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

  // Previously, the resolution text area would not render to the appropriate height relative to the amount of content
  // when navigating from another step.  In hooking into the visibility change event on the resolution text area via the
  // v-observe-visibility property, we are able to force a re-calculation of the text area height when a user navigates
  // to the complete resolution summary step from another step for the first time. This results in the text area being
  // rendered to the appropriate height.
  onResolutionVisibilityChanged (isVisible: boolean, _entry): void {
    if (isVisible && this.resolutionTextHeightUpdateRequired) {
      this.resolutionTextHeightUpdateRequired = false
      this.$refs.resolutionTextRef.calculateInputHeight()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// styles specific to resolution summary section
#resolution-summary-section-3 {
  :deep() {
    // remove dotted line bottom border on text area
    .v-text-field.v-input--is-readonly .v-input__slot:before {
      border-style: none !important;
    }

    // remove extra bottom and top margins from text area
    .v-text-field.v-text-field--enclosed .v-text-field__details {
      margin-bottom: 0px !important;
    }

    .v-input__slot {
      margin-bottom: 0px !important
    }

    .v-textarea.v-text-field--box .v-text-field__prefix,
    .v-textarea.v-text-field--box textarea,
    .v-textarea.v-text-field--enclosed .v-text-field__prefix,
    .v-textarea.v-text-field--enclosed textarea {
      margin-top: 0px !important;
    }

    .v-textarea.v-text-field--enclosed.v-text-field--single-line:not(.v-input--dense) textarea {
      margin-top: 0px !important;
    }

    // remove min-height requirements for text area
    .v-text-field--outlined > .v-input__control > .v-input__slot {
      min-height: 0px !important;
    }

    .v-text-field--filled > .v-input__control > .v-input__slot,
    .v-text-field--full-width > .v-input__control > .v-input__slot,
    .v-text-field--outlined > .v-input__control > .v-input__slot {
      min-height: 0px !important;
    }

    // set line-height for text area such that it lines with label text
    .v-textarea textarea {
      line-height: 1.45rem !important;
    }

    // remove text area padding
    .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot,
    .v-text-field.v-text-field--enclosed .v-text-field__details {
      padding: 0px !important;
    }

    #resolution-text {
      margin-top: 0px !important;
      color: $gray7 !important;
    }
  }
}

.v-icon.mdi-information-outline,
.v-icon.mdi-check {
  margin-top: -2px;
}
</style>
