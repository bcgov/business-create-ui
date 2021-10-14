<template>
  <div id="review-confirm-dissolution">

    <section class="mt-10 pb-2 section-container">
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-1">Review the information in your filing. If you need to change or complete anything, return
          to the step to make the necessary change.</p>
      </header>
    </section>

    <!-- Define Dissolution Summary -->
    <v-card flat class="rounded-4">
      <div class="review-header">
        <v-icon class="ml-2" color="appDkBlue">mdi-domain</v-icon>
        <label class="pl-2"><strong>Dissolution</strong></label>
      </div>

      <section :class="{ 'invalid-section': !mockIsValid }">
        <div v-if="!mockIsValid" class="defineDissolutionError">
          <span>
            <v-icon color="error">mdi-information-outline</v-icon>
            &nbsp;
            <span class="error-text">This step is unfinished.</span>
            &nbsp;
            <router-link
              :to="{ path: `/${RouteNames.DEFINE_DISSOLUTION}` }"
            >Return to this step to finish it</router-link>
          </span>
        </div>
        <AssociationDetails :isSummary="true"/>
      </section>
    </v-card>

    <!-- Dissolution Date Time -->
    <div class="ma-6 pb-6" v-if="!isTypeCoop">
      <v-container
        id="effective-date-time"
        class="alteration-date-time"
        :class="{ 'invalid': getEffectiveDateTime.valid }">
        <v-row no-gutters>
          <v-col cols="3" class="inner-col-1">
            <label><strong>Alteration Date<br>and Time</strong></label>
          </v-col>

          <v-col cols="9" class="inner-col-2">
            <p id="effective-date-time-instructions" class="info-text">
              Select the date and time of alteration of your business. You may select a date and time up to 10 days in
              the future (note: there is an <strong>additional fee {{futureEffectiveFeePrice}}</strong> to
              enter an alteration date and time in the future). Unless a business has special requirements, most
              businesses select an immediate Alteration Date and Time.
            </p>

            <EffectiveDateTime
              :currentJsDate="getCurrentJsDate"
              :effectiveDateTime="getEffectiveDateTime"
              :isAppValidate="true"
              @valid="setEffectiveDateValid($event)"
              @effectiveDate="setEffectiveDate($event)"
              @isFutureEffective="setIsFutureEffective($event)"
            />

            <v-card
              flat
              class="px-16 pb-8 mt-n12"
              id="effective-date-text"
              v-if="getEffectiveDateTime.isFutureEffective && getEffectiveDateTime.valid"
            >
              The alteration for this business will be effective as of:<br>
              <strong>{{futureEffectiveDate}}</strong>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { ActionBindingIF, EffectiveDateTimeIF, FeesIF } from '@/interfaces'
import { DateMixin } from '@/mixins'

// Components
import { AssociationDetails } from '@/components/DefineDissolution'
import { EffectiveDateTime } from '@/components/common'

// Enums
import { RouteNames } from '@/enums'

@Component({
  components: {
    AssociationDetails,
    EffectiveDateTime
  }
})
export default class ReviewConfirmDissolution extends Mixins(DateMixin) {
  // Global getters
  // @Getter getCurrentJsDate!: Date
  @Getter isTypeCoop!: boolean
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getFeePrices!: FeesIF

  // Global actions
  @Action setEffectiveDateValid!: ActionBindingIF
  @Action setEffectiveDate!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF

  // Enum for template
  readonly RouteNames = RouteNames

  private mockIsValid = true // TODO: Build out Validation checks when we have Step 1 Complete

  get futureEffectiveFeePrice (): string {
    if (this.getFeePrices.futureEffectiveFees !== null) {
      return `of $${this.getFeePrices.futureEffectiveFees.toFixed(2)}`
    }
  }

  get futureEffectiveDate (): string {
    return this.dateToPacificDateTime(this.getEffectiveDateTime.effectiveDate)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.defineDissolutionError {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $app-red;
}

.section-container {
  font-size: 1rem;
  color: $gray7;

  label {
    color: $gray9;
  }
}

.review-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
  color: $gray9;
}

.v-icon.mdi-information-outline {
  margin-top: -2px;
}

.alteration-date-time {
  padding: 2rem;
  background-color: $gray1;

  &.invalid {
    border-left: 4px solid $BCgovInputError;
    padding-left: calc(2rem - 4px);

    label {
      color: $BCgovInputError;
    }
  }
}

.inner-col-1 {
  // adjustment to make this inner container column the same width as the outer columns
  // ie, decrease width by 1/2 container margin + padding
  flex: 0 0 calc(25% - 1.5rem);
}

.inner-col-2 {
  // adjustment to make this inner container column the same width as the outer columns
  // ie, increase width by 1/2 container margin + padding
  flex: 0 0 calc(75% + 1.5rem);
  max-width: calc(75% + 1.5rem);
}

#effective-date-text {
  color: $gray7;
}
</style>
