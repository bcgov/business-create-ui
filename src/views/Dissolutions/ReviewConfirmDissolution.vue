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
        <div class="mx-6 pl-2" v-if="!isTypeCoop && isRoleStaff">
          <v-container class="py-0">
            <v-divider  />
          </v-container>
        </div>

        <!-- Dissolution Date and Time -->
        <section class="mx-6 pl-2" v-if="!isTypeCoop && isRoleStaff">
          <v-container
            id="effective-date-time"
            :class="{ 'invalid': isDissolutionDateTimeInvalid }"
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
                  :isAppValidate="getValidateSteps"
                  @valid="setEffectiveDateTimeValid($event)"
                  @effectiveDate="setEffectiveDate($event)"
                  @isFutureEffective="setIsFutureEffective($event)"
                />

                <v-card
                  flat class="px-16 pb-8 mt-n12"
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
          <label class="font-weight-bold pl-2">{{getCreateResolutionResource.reviewConfirmHeader}}</label>
        </header>
        <section v-if="!getCreateResolutionStep.validationDetail.valid" class="section-container invalid-section">
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text ml-1 mr-2">This step is unfinished.</span>
          <router-link
            :to="{ path: `/${RouteNames.CREATE_RESOLUTION}` }"
          >Return to this step to finish it</router-link>
        </section>
        <section v-if="getCreateResolutionStep.validationDetail.valid" class="section-container upload-success-message">
          <v-row no-gutters>
            <v-col md="1">
              <v-icon class="success-chk">mdi-check</v-icon>
            </v-col>
            <v-col v-if="isTypeCoop" md="11" id="file-name-col">
              <span>FILE_NAME_PLACEHOLDER</span>
            </v-col>
            <v-col v-if="isBaseCompany" md="11" id="file-name-col">
              <span>The resolution was completed and deposited in the Company's records book.</span>
            </v-col>
          </v-row>
        </section>
    </v-card>

    <!-- Affidavit -->
    <v-card flat id="affidavit-summary" class="mt-10">
      <header class="review-header rounded-t">
        <v-icon class="ml-2" color="appDkBlue">mdi-book-variant-multiple</v-icon>
        <label class="font-weight-bold pl-2">Affidavit</label>
      </header>

      <div class="section-container" :class="{ 'invalid-section': isAffidavitInvalid }">
        <section v-if="isAffidavitInvalid">
          <v-icon color="error">mdi-information-outline</v-icon>
          &nbsp;
          <span class="error-text">This step is unfinished.</span>
          &nbsp;
          <router-link
            :to="{ path: `/${RouteNames.UPLOAD_AFFIDAVIT}` }"
          >Return to this step to finish it</router-link>
        </section>

        <div v-else class="upload-affidavit-success-message">
          <v-icon class="upload-success-chk ml-n1 pr-2" color="successCheckmark">mdi-check</v-icon>
          <span id="file-name" class="break-spaces">{{ affidavitSummary }}</span>
        </div>
      </div>
    </v-card>

    <!-- Dissolution Documents Delivery -->
    <section id="document-delivery-section" class="mt-10">
      <header>
        <h2>{{getHeaderNumber('documentDelivery')}}. Dissolution Documents Delivery</h2>
        <p class="mt-1">Copies of the dissolution documents will be sent to the following email addresses listed
          below.
        </p>
      </header>
      <div :class="{ 'invalid-section': isDocumentDeliveryInvalid }">
        <DocumentDelivery
          :editableCompletingParty="isRoleStaff"
          :showCustodianEmail="true"
          :invalidSection="isDocumentDeliveryInvalid"
        />
      </div>
    </section>

    <!-- Folio Number -->
    <section id="folio-number-section" class="mt-10" v-if="isPremiumAccount">
      <h2>{{getHeaderNumber('folioNumber')}}. Folio Number</h2>
      FUTURE
    </section>

    <!-- Certify -->
    <section id="certify-section" class="mt-10">
      <header>
        <h2>{{getHeaderNumber('certify')}}. Certify</h2>
        <p class="mt-1">Confirm the legal name of the person authorized to complete and submit this application.</p>
      </header>
      <div :class="{ 'invalid-section': isCertifyInvalid }">
        <Certify
          :currentDate="getCurrentDate"
          :certifiedBy="getCertifyState.certifiedBy"
          :entityDisplay="getCompletingPartyStatement.entityDisplay"
          :isCertified="getCertifyState.valid"
          :statements="getCompletingPartyStatement.certifyStatements"
          :message="getCompletingPartyStatement.certifyClause"
          :isStaff="isRoleStaff"
          :firstColumn="3"
          :secondColumn="9"
          :invalidSection="isCertifyInvalid"
          :disableEdit="!isRoleStaff"
          @update:certifiedBy="onCertifiedBy($event)"
          @update:isCertified="onIsCertified($event)"
        />
      </div>
    </section>

    <!-- Court Order and Plan of Arrangement -->
    <section id="poa-plan-arrangement-section" class="mt-10" v-if="isRoleStaff">
      <h2>{{getHeaderNumber('courtOrder')}}. Court Order and Plan of Arrangement</h2>
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
    <section id="staff-payment-section" class="mt-10" v-if="isRoleStaff">
      <h2>{{getHeaderNumber('staffPayment')}}. Staff Payment</h2>
      <StaffPayment />
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { DateMixin } from '@/mixins'

// Components
import { AssociationDetails, DissolutionStatement } from '@/components/DefineDissolution'
import { Certify, CourtOrderPoa, EffectiveDateTime } from '@/components'
import { DocumentDelivery, StaffPayment } from '@/components/common'

// Enums
import { RouteNames } from '@/enums'

// Interfaces
import {
  ActionBindingIF,
  CertifyIF,
  CertifyStatementIF,
  CourtOrderStepIF,
  CreateResolutionIF,
  CreateResolutionResourceIF,
  DissolutionStatementIF,
  DocumentDeliveryIF,
  EffectiveDateTimeIF,
  FeesIF,
  UploadAffidavitIF
} from '@/interfaces'

@Component({
  components: {
    AssociationDetails,
    Certify,
    CourtOrderPoa,
    DissolutionStatement,
    DocumentDelivery,
    EffectiveDateTime,
    StaffPayment
  }
})
export default class ReviewConfirmDissolution extends Mixins(DateMixin) {
  // Global getters
  @Getter getAffidavitStep!: UploadAffidavitIF
  @Getter getCertifyState!: CertifyIF
  @Getter getCompletingPartyStatement!: CertifyStatementIF
  @Getter getCourtOrderStep!: CourtOrderStepIF
  @Getter getCurrentDate!: string
  @Getter getDissolutionStatementStep!: DissolutionStatementIF
  @Getter getDocumentDelivery!: DocumentDeliveryIF
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getFeePrices!: FeesIF
  @Getter getCreateResolutionResource!: CreateResolutionResourceIF
  @Getter getCreateResolutionStep!: CreateResolutionIF
  @Getter getShowErrors!: boolean
  @Getter getValidateSteps!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter isRoleStaff!: boolean
  @Getter isTypeCoop!: boolean
  @Getter isBaseCompany!: boolean

  // Global actions
  @Action setIgnoreChanges!: ActionBindingIF
  @Action setEffectiveDateTimeValid!: ActionBindingIF
  @Action setEffectiveDate!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setCourtOrderFileNumber!: ActionBindingIF
  @Action setHasPlanOfArrangement!: ActionBindingIF
  @Action setCourtOrderValidity!: ActionBindingIF
  @Action setCertifyState!: ActionBindingIF

  // Enum for template
  readonly RouteNames = RouteNames

  /** Called when component is created. */
  private created (): void {
    // ignore data changes until page has loaded
    this.setIgnoreChanges(true)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  private getHeaderNumber (sectionName): number {
    const userHeaderNumbers: any = { documentDelivery: 1, certify: 2 }
    const premiumHeaderNumbers: any = { documentDelivery: 1, folioNumber: 2, certify: 3 }
    const staffHeaderNumbers: any = { documentDelivery: 1, certify: 2, courtOrder: 3, staffPayment: 4 }

    let headerNumbers = userHeaderNumbers
    if (this.isPremiumAccount) {
      headerNumbers = premiumHeaderNumbers
    } else if (this.isRoleStaff) {
      headerNumbers = staffHeaderNumbers
    }
    return headerNumbers[sectionName]
  }

  /** Is true when the Define Dissolution conditions are not met. */
  private get isDefineDissolutionInvalid (): boolean {
    return this.getShowErrors &&
      (this.isTypeCoop && !this.getDissolutionStatementStep.valid)
  }

  /** Is true when the Dissolution Date and Time section is invalid. */
  private get isDissolutionDateTimeInvalid (): boolean {
    return (this.getValidateSteps && !this.getEffectiveDateTime.valid)
  }

  /** Is true when the Court Order conditions are not met. */
  private get isCourtOrderInvalid (): boolean {
    return (this.getValidateSteps && !this.getCourtOrderStep.valid)
  }

  /** Is true when the Document Delivery conditions are not met. */
  private get isDocumentDeliveryInvalid (): boolean {
    return (this.getValidateSteps && !this.getDocumentDelivery.valid)
  }

  /** Is true when the Affidavit conditions are not met. */
  private get isAffidavitInvalid (): boolean {
    if (this.isTypeCoop) {
      return !this.getAffidavitStep.validationDetail.valid
    } else {
      // Just validate the confirm checkbox for Corps
      return !this.getAffidavitStep.validationDetail.validationItemDetails[0]?.valid
    }
  }

  private get affidavitSummary (): string {
    return this.isTypeCoop
      ? this.getAffidavitStep.affidavitDoc?.name
      : `The affidavit required by section 316(1)(a) of the Business Corporations Act has been completed and deposited
      in the company's records book.`
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

  /** Is true when the certify conditions are not met. */
  private get isCertifyInvalid () {
    return this.getValidateSteps && (!this.getCertifyState.certifiedBy || !this.getCertifyState.valid)
  }

  /** Handler for Valid change event. */
  private onIsCertified (val: boolean): void {
    this.setCertifyState(
      {
        valid: val,
        certifiedBy: this.getCertifyState.certifiedBy
      }
    )
  }

  /** Handler for CertifiedBy change event. */
  private onCertifiedBy (val: string): void {
    this.setCertifyState(
      {
        valid: this.getCertifyState.valid,
        certifiedBy: val
      }
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#dissolution-summary .v-divider {
  background-color: $gray1;
}

.section-container {
  padding: 1.5rem 1.5rem;
}

.review-header {
  display: flex; // to align icons
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
  color: $gray9;
}

.v-icon.mdi-information-outline {
  margin-top: -2px;
  margin-right: 4px;
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

  #court-order-label, #poa-label {
    font-size: 1rem;
    font-weight: bold;
    color: $gray9;
  }
}

.upload-success-message {
  color: $gray7;

  .success-chk {
    font-size: 1.5rem;
    color: $app-dk-green;
  }

  #file-name-col {
    margin-top: 2px;
    margin-left: -46px;
  }
}

::v-deep #AR-step-4-container, ::v-deep #document-delivery {
  .row {
    .col-3 {
      label {
        font-size: 1rem;
        color: $gray9;
        padding-left: 0.75rem;
      }
    }

    .col-9 {
      padding-left: 0.5rem !important;
    }
  }
}

::v-deep #AR-step-4-container {
  .container {
    padding-right: 4px !important;
  }
}
</style>
