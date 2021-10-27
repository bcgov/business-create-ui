<template>
  <div id="review-confirm-dissolution" class="mt-10">
    <header>
      <h2>Review and Confirm</h2>
      <p id="intro-text" class="mt-2">
        Review the information in your filing. If you need to change or complete anything, return
        to the step to make the necessary change.
      </p>
    </header>

    <!-- Dissolution -->
    <v-card flat id="dissolution-summary" class="mt-8">
      <header class="review-header rounded-t">
        <v-icon class="ml-2" color="appDkBlue">mdi-domain-remove</v-icon>
        <label class="font-weight-bold pl-2">Dissolution</label>
      </header>

      <div  class="pb-8" :class="{ 'invalid-section': isDefineDissolutionInvalid }">
        <section class="pt-8 pl-7" v-if="isDefineDissolutionInvalid">
          <span>
            <v-icon color="error">mdi-information-outline</v-icon>
            &nbsp;
            <span class="error-text">This step is unfinished.</span>
            &nbsp;
            <router-link
              :to="{ path: `/${RouteNames.DEFINE_DISSOLUTION}` }"
            >Return to this step to finish it</router-link>
          </span>
        </section>

        <!-- Association Details -->
        <section>
          <AssociationDetails :isSummary="true"/>
        </section>

        <!-- Dissolution Statement -->
        <section class="mx-6 pl-2" v-if="isTypeCoop">
          <v-container id="dissolution-statement">
            <v-row no-gutters>
              <v-col cols="3" class="inner-col-1">
                <label class="font-weight-bold">Dissolution<br>Statement</label>
              </v-col>

              <v-col cols="9" class="inner-col-2">
                <DissolutionStatement :isSummary="true" />
              </v-col>
            </v-row>
          </v-container>
        </section>

        <!-- divider -->
        <div class="mx-6 pl-2" v-if="isTypeCoop">
          <v-container class="py-0">
            <v-divider  />
          </v-container>
        </div>

        <!-- Custodian of Records -->
        <section class="mx-6 pl-2">
          <v-container id="custodian-of-records">
            <v-row no-gutters>
              <v-col cols="3" class="inner-col-1">
                <label class="font-weight-bold">Custodian<br>of Records</label>
              </v-col>

              <v-col cols="9" class="inner-col-2">
                FUTURE
              </v-col>
            </v-row>
          </v-container>
        </section>

        <!-- divider -->
        <div class="mx-6 pl-2">
          <v-container class="py-0">
            <v-divider  />
          </v-container>
        </div>

        <!-- Dissolution Date and Time -->
        <section class="mx-6 pl-2" v-if="!isTypeCoop">
          <v-container
            id="effective-date-time"
            :class="{ 'invalid': getEffectiveDateTime.valid }"
          >
            <v-row no-gutters>
              <v-col cols="3" class="inner-col-1">
                <label class="font-weight-bold">Dissolution<br>Date and Time</label>
              </v-col>

              <v-col cols="9" class="inner-col-2">
                <p id="effective-date-time-instructions" class="info-text">
                  Select the date and time of the dissolution of the Company. You may select a date
                  up to 10 days in the future (note: there is an <strong>additional fee of
                  {{futureEffectiveFeePrice}}</strong> to enter a dissolution date in the future).
                  Unless a business has special requirements, most businesses select an immediate
                  date and time for dissolution.
                </p>

                <EffectiveDateTime
                  :currentJsDate="getCurrentJsDate"
                  :effectiveDateTime="getEffectiveDateTime"
                  :isAppValidate="true"
                  @valid="setEffectiveDateTimeValid($event)"
                  @effectiveDate="setEffectiveDate($event)"
                  @isFutureEffective="setIsFutureEffective($event)"
                />

                <v-card
                  flat
                  class="px-16 pb-8 mt-n12"
                  id="effective-date-text"
                  v-if="getEffectiveDateTime.isFutureEffective && getEffectiveDateTime.valid"
                >
                  The dissolution for this business will be effective as of:<br>
                  <strong>{{futureEffectiveDate}}</strong>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </section>
      </div>
    </v-card>

    <!-- Resolution -->
    <v-card flat id="resolution-summary" class="mt-10">
      <header class="review-header rounded-t">
        <v-icon class="ml-2" color="appDkBlue">mdi-handshake</v-icon>
        <label class="font-weight-bold pl-2">Resolution</label>
      </header>

      <section class="section-container">
        FUTURE
      </section>
    </v-card>

    <!-- Affidavit -->
    <v-card flat id="affidavit-summary" class="mt-10">
      <header class="review-header rounded-t">
        <v-icon class="ml-2" color="appDkBlue">mdi-book-variant-multiple</v-icon>
        <label class="font-weight-bold pl-2">Affidavit</label>
      </header>

      <section class="section-container">
        FUTURE
      </section>
    </v-card>

    <!-- Dissolution Documents Delivery -->
    <section id="document-delivery-section" class="mt-10">
      <h2>X. Dissolution Documents Delivery</h2>
      FUTURE
    </section>

    <!-- Certify -->
    <section id="certify-section" class="mt-10">
      <h2>X. Certify</h2>
      FUTURE
    </section>

    <!-- Court Order and Plan of Arrangement -->
    <section id="poa-plan-arrangement-section" class="mt-10" v-if="isRoleStaff">
      <h2>X. Court Order and Plan of Arrangement</h2>
      <p class="my-3 pb-2">
        If this filing is pursuant to a court order, enter the court order number. If this
        filing is pursuant to a plan of arrangement, enter the court order number and select
        Plan of Arrangement.
      </p>
      <CourtOrderPoa
        class="pl-2"
        :class="{'invalid-section': isCourtOrderInvalid}"
        id="court-order"
        :autoValidation="getValidateSteps"
        :draftCourtOrderNumber="getCourtOrderStep.courtOrder.fileNumber"
        :hasDraftPlanOfArrangement="getCourtOrderStep.courtOrder.hasPlanOfArrangement"
        :courtOrderNumberRequired="true"
        :invalidSection="isCourtOrderInvalid"
        @emitCourtNumber="setCourtOrderFileNumber($event)"
        @emitPoa="setHasPlanOfArrangement($event)"
        @emitValid="setCourtOrderValidity($event)"
      />
    </section>

    <!-- Staff Payment -->
    <section id="staff-payment" class="mt-10" v-if="isRoleStaff">
      <h2>X. Staff Payment</h2>
      <StaffPayment />
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { ActionBindingIF, EffectiveDateTimeIF, FeesIF, DissolutionStatementIF, CourtOrderStepIF } from '@/interfaces'
import { DateMixin } from '@/mixins'

// Components
import { AssociationDetails, DissolutionStatement } from '@/components/DefineDissolution'
import { EffectiveDateTime, StaffPayment } from '@/components/common'
import { CourtOrderPoa } from '@bcrs-shared-components/court-order-poa'

// Enums
import { RouteNames } from '@/enums'

@Component({
  components: {
    AssociationDetails,
    CourtOrderPoa,
    DissolutionStatement,
    EffectiveDateTime,
    StaffPayment
  }
})
export default class ReviewConfirmDissolution extends Mixins(DateMixin) {
  // Global getters
  // @Getter getCurrentJsDate!: Date
  @Getter isRoleStaff!: boolean
  @Getter isTypeCoop!: boolean
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getFeePrices!: FeesIF
  @Getter getDissolutionStatementStep!: DissolutionStatementIF
  @Getter getCourtOrderStep!: CourtOrderStepIF
  @Getter getShowErrors!: boolean
  @Getter getValidateSteps!: boolean

  // Global actions
  @Action setEffectiveDateTimeValid!: ActionBindingIF
  @Action setEffectiveDate!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setCourtOrderFileNumber!: ActionBindingIF
  @Action setHasPlanOfArrangement!: ActionBindingIF
  @Action setCourtOrderValidity!: ActionBindingIF

  // Enum for template
  readonly RouteNames = RouteNames

  // TODO: Build out validation checks with each component
  /** Is true when the Define Dissolution conditions are not met. */
  get isDefineDissolutionInvalid () {
    return this.getShowErrors &&
      (this.isTypeCoop && !this.getDissolutionStatementStep.valid)
  }

  /** Is true when the Court Order conditions are not met. */
  get isCourtOrderInvalid (): boolean {
    return (this.getValidateSteps && !this.getCourtOrderStep.valid)
  }

  get futureEffectiveFeePrice (): string {
    if (this.getFeePrices.futureEffectiveFees) {
      return `$${this.getFeePrices.futureEffectiveFees.toFixed(2)}`
    }
    return 'TBD'
  }

  get futureEffectiveDate (): string {
    return this.dateToPacificDateTime(this.getEffectiveDateTime.effectiveDate, true)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#dissolution-summary .v-divider {
  background-color: $gray1;
}

.section-container {
  padding: 1.5rem 2rem;
}

.review-header {
  display: flex; // to align icons
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
  color: $gray9;
}

.v-icon.mdi-information-outline {
  margin-top: -2px;
}

// #custodian-of-records,
// #effective-date-time {
.container {
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
  flex: 0 0 calc(25% - 1rem);
}

.inner-col-2 {
  // adjustment to make this inner container column the same width as the outer columns
  // ie, increase width by 1/2 container margin + padding
  flex: 0 0 calc(75% + 1rem);
  max-width: calc(75% + 1rem);
}

#effective-date-text {
  color: $gray7;
}

::v-deep #court-order {
  .row {
    .col-9 {
      padding-left: 1rem !important;
    }
  }
}
</style>
