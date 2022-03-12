<template>
  <div id="dissolution-review-confirm">
    <!-- Review and Confirm -->
    <section class="mt-10">
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-4">
          Review the information in your filing. If you need to change or complete anything, return
          to the step to make the necessary change.
        </p>
      </header>

      <!-- Dissolution summary -->
      <v-card flat id="dissolution-summary" class="mt-6">
        <header class="review-header rounded-t">
          <v-icon class="ml-2" color="appDkBlue">mdi-domain-remove</v-icon>
          <label class="font-weight-bold pl-2">Dissolution</label>
        </header>

        <div class="pb-8" :class="{ 'invalid-section rounded-bl-0': !isDissolutionDefineDissolutionValid }">
          <section class="pt-8 pl-7" v-if="!isDissolutionDefineDissolutionValid">
            <span>
              <v-icon color="error">mdi-information-outline</v-icon>
              &nbsp;
              <span class="error-text">This step is unfinished.</span>
              &nbsp;
              <router-link
                :to="{ path: `/${RouteNames.DISSOLUTION_DEFINE_DISSOLUTION}` }"
              >Return to this step to finish it</router-link>
            </span>
          </section>

          <!-- Association Details -->
          <section>
            <AssociationDetails :isSummary="true"/>
          </section>

          <!-- Dissolution Statement -->
          <template v-if="isTypeCoop">
            <section class="mx-6">
              <DissolutionStatement :isSummary="true" />
            </section>

            <!-- divider -->
            <div class="mx-6">
              <v-container class="py-0">
                <v-divider />
              </v-container>
            </div>
          </template>

          <!-- Custodian of Records -->
          <section class="mx-6">
            <CustodianOfRecords :isSummary="true" />
          </section>

          <!-- Destroy Certificates -->
          <template v-if="isTypeCoop">
            <!-- divider -->
            <div class="mx-6">
              <v-container class="py-0">
                <v-divider />
              </v-container>
            </div>

            <section class="mx-6">
              <DestroyCertificate :isSummary="true" />
            </section>
          </template>

          <!-- Dissolution Date and Time -->
          <template v-if="!isTypeCoop">
            <!-- divider -->
            <div class="mx-6">
              <v-container class="py-0">
                <v-divider />
              </v-container>
            </div>

            <section class="mx-6">
              <v-container
                id="effective-date-time"
                :class="{ 'invalid': isDissolutionDateTimeInvalid }"
              >
                <v-row no-gutters>
                  <v-col cols="3" class="inner-col-1 pr-4">
                    <label class="font-weight-bold">Dissolution Date and Time</label>
                  </v-col>

                  <v-col cols="9" class="inner-col-2">
                    <p id="effective-date-time-instructions" class="info-text">
                      Select the date and time of the dissolution of the Company. You may select a date
                      up to 10 days in the future (note: there is an <strong>additional fee of
                      {{ futureEffectiveFeePrice }}</strong> to enter a dissolution date in the future).
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

                    <v-card flat class="px-16 pb-8 mt-n12"
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
          </template>
        </div>
      </v-card>
    </section>

    <!-- Resolution -->
    <v-card flat id="resolution-summary" class="mt-10">
      <header class="review-header rounded-t">
        <v-icon class="ml-2" color="appDkBlue">mdi-handshake</v-icon>
        <label class="font-weight-bold pl-2">{{getCreateResolutionResource.reviewConfirmHeader}}</label>
      </header>
      <CompleteResolutionSummary />
    </v-card>

    <!-- Affidavit -->
    <v-card flat id="affidavit-summary" class="mt-10">
      <header class="review-header rounded-t">
        <v-icon class="ml-2" color="appDkBlue">mdi-book-variant-multiple</v-icon>
        <label class="font-weight-bold pl-2">Affidavit</label>
      </header>

      <section v-if="!isAffidavitValid" class="section-container invalid-section rounded-bl-0">
        <v-icon color="error">mdi-information-outline</v-icon>
        &nbsp;
        <span class="error-text">This step is unfinished.</span>
        &nbsp;
        <router-link
          :to="{ path: `/${RouteNames.DISSOLUTION_AFFIDAVIT}` }"
        >Return to this step to finish it</router-link>
      </section>

      <section v-else class="section-container rounded-bl-0">
        <v-icon class="ml-1 pr-2" color="successCheckmark">mdi-check</v-icon>
        <span id="file-name" class="break-spaces">{{ affidavitSummary }}</span>
      </section>
    </v-card>

    <!-- Dissolution Documents Delivery -->
    <section id="document-delivery-section" class="mt-10">
      <header>
        <h2>Dissolution Documents Delivery</h2>
        <p class="mt-4">
          Copies of the dissolution documents will be sent to the email addresses listed below.
        </p>
      </header>
      <DocumentDelivery
        class="mt-6"
        :class="{ 'invalid-section': isDocumentDeliveryInvalid }"
        :editableCompletingParty="isRoleStaff"
        :showCustodianEmail="true"
        :invalidSection="isDocumentDeliveryInvalid"
        :registeredOfficeEmail="getBusinessContact.email"
        :custodianEmail="getDissolutionCustodianEmail"
        :completingPartyEmail="getUserEmail"
        :documentOptionalEmail="getDocumentDelivery.documentOptionalEmail"
        @update:optionalEmail="setDocumentOptionalEmail($event)"
        @valid="setDocumentOptionalEmailValidity($event)"
      />
    </section>

    <!-- Transactional Folio Number -->
    <section id="folio-number-section" class="mt-10" v-if="isPremiumAccount">
      <header>
        <h2>Folio or Reference Number for this Filing</h2>
        <p class="mt-4">
          Enter the folio or reference number you want to use for this filing for your own tracking
          purposes. The Business Folio or Reference Number is displayed below (if available).
          Entering a different value below will not change the Business Folio or Reference Number.
          Only the number below will appear on the transaction report and receipt for this filing.
        </p>
      </header>
      <TransactionalFolioNumber
        class="mt-6"
        :accountFolioNumber="getFolioNumber"
        :transactionalFolioNumber="getTransactionalFolioNumber"
        :doValidate="getValidateSteps"
        @change="setTransactionalFolioNumber($event)"
        @valid="setTransactionalFolioNumberValidity($event)"
      />
    </section>

    <!-- Certify -->
    <section id="certify-section" class="mt-10">
      <header>
        <h2>Certify</h2>
        <p class="mt-4">
          Confirm the legal name of the person authorized to complete and submit this dissolution.
        </p>
      </header>
      <Certify
        class="mt-6"
        :class="{ 'invalid-section': isCertifyInvalid }"
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
    </section>

    <!-- Court Order and Plan of Arrangement -->
    <section id="court-order-poa-section" class="mt-10" v-if="isRoleStaff">
      <header>
        <h2>Court Order and Plan of Arrangement</h2>
        <p class="mt-4">
          If this filing is pursuant to a court order, enter the court order number. If this
          filing is pursuant to a plan of arrangement, enter the court order number and select
          Plan of Arrangement.
        </p>
      </header>
      <CourtOrderPoa
        id="court-order"
        class="mt-6"
        :class="{ 'invalid-section': isCourtOrderInvalid }"
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
      <header>
        <h2>Staff Payment</h2>
        <p class="mt-4"></p>
      </header>
      <StaffPayment
        class="mt-6"
      />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { DateMixin } from '@/mixins'
import AssociationDetails from '@/components/Dissolution/AssociationDetails.vue'
import { Certify } from '@bcrs-shared-components/certify'
import CompleteResolutionSummary from '@/components/Dissolution/CompleteResolutionSummary.vue'
import { CourtOrderPoa } from '@bcrs-shared-components/court-order-poa'
import CustodianOfRecords from '@/components/Dissolution/CustodianOfRecords.vue'
import DestroyCertificate from '@/components/Dissolution/DestroyCertificate.vue'
import DissolutionStatement from '@/components/Dissolution/DissolutionStatement.vue'
import DocumentDelivery from '@/components/common/DocumentDelivery.vue'
import { EffectiveDateTime } from '@bcrs-shared-components/effective-date-time'
import StaffPayment from '@/components/common/StaffPayment.vue'
import TransactionalFolioNumber from '@/components/common/TransactionalFolioNumber.vue'
import { RouteNames } from '@/enums'
import {
  ActionBindingIF,
  BusinessContactIF,
  CertifyIF,
  CertifyStatementIF,
  CourtOrderStepIF,
  CreateResolutionIF,
  CreateResolutionResourceIF,
  DocumentDeliveryIF,
  EffectiveDateTimeIF,
  FeesIF,
  UploadAffidavitIF
} from '@/interfaces'

@Component({
  components: {
    AssociationDetails,
    Certify,
    CompleteResolutionSummary,
    CourtOrderPoa,
    CustodianOfRecords,
    DestroyCertificate,
    DissolutionStatement,
    DocumentDelivery,
    EffectiveDateTime,
    StaffPayment,
    TransactionalFolioNumber
  }
})
export default class DissolutionReviewConfirm extends Mixins(DateMixin) {
  // Global getters
  @Getter getAffidavitStep!: UploadAffidavitIF
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getCertifyState!: CertifyIF
  @Getter getCompletingPartyStatement!: CertifyStatementIF
  @Getter getCourtOrderStep!: CourtOrderStepIF
  @Getter getCurrentDate!: string
  @Getter getDissolutionCustodianEmail!: string
  @Getter getDocumentDelivery!: DocumentDeliveryIF
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getCreateResolutionResource!: CreateResolutionResourceIF
  @Getter getCreateResolutionStep!: CreateResolutionIF
  @Getter getFeePrices!: Array<FeesIF>
  @Getter getDissolutionHasCertificateDestroyed!: boolean
  @Getter getUserEmail!: string
  @Getter getValidateSteps!: boolean
  @Getter isAffidavitValid!: boolean
  @Getter isDissolutionDefineDissolutionValid!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter isRoleStaff!: boolean
  @Getter isTypeCoop!: boolean
  @Getter getFolioNumber!: string
  @Getter getTransactionalFolioNumber!: string

  // Global actions
  @Action setEffectiveDateTimeValid!: ActionBindingIF
  @Action setEffectiveDate!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setCourtOrderFileNumber!: ActionBindingIF
  @Action setHasPlanOfArrangement!: ActionBindingIF
  @Action setCourtOrderValidity!: ActionBindingIF
  @Action setCertifyState!: ActionBindingIF
  @Action setDocumentOptionalEmail!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF
  @Action setTransactionalFolioNumber!: ActionBindingIF
  @Action setTransactionalFolioNumberValidity!: ActionBindingIF

  // Enum for template
  readonly RouteNames = RouteNames

  /** Is true when the Dissolution Date and Time section is invalid. */
  get isDissolutionDateTimeInvalid (): boolean {
    return (this.getValidateSteps && !this.getEffectiveDateTime.valid)
  }

  /** Is true when the Court Order conditions are not met. */
  get isCourtOrderInvalid (): boolean {
    return (this.getValidateSteps && !this.getCourtOrderStep.valid)
  }

  /** Is true when the Document Delivery conditions are not met. */
  get isDocumentDeliveryInvalid (): boolean {
    return (this.getValidateSteps && !this.getDocumentDelivery.valid)
  }

  /** The affidavit summary to display, depending on entity type. */
  get affidavitSummary (): string {
    return this.isTypeCoop
      ? this.getAffidavitStep.affidavitDoc?.name
      : 'The affidavit required by section 316(1)(a) of the Business Corporations Act has ' +
        'been completed and deposited in the company\'s records book.'
  }

  /** The future effective fee price. */
  get futureEffectiveFeePrice (): string {
    if (this.getFeePrices[0]?.futureEffectiveFees) {
      return `$${this.getFeePrices[0].futureEffectiveFees.toFixed(2)}`
    }
    return 'TBD'
  }

  /** The future effective date, in Pacific date-time format. */
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

#dissolution-review-confirm {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}

::v-deep .section-container {
  padding: 2rem 1.5rem;
}

.review-header {
  display: flex; // to align icons
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
  color: $gray9;
}

.v-icon.mdi-check,
.v-icon.mdi-information-outline {
  margin-top: -2px;
}

.container {
  padding: 2rem;
  background-color: $gray1;

  &.invalid {
    border-left: 3px solid $BCgovInputError;
    padding-left: calc(2rem - 3px);

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

// FUTURE: this should be under court-order-poa-section below
::v-deep #court-order {
  .row {
    .col-9 {
      padding-left: 1rem !important;
    }
  }

  #court-order-label,
  #poa-label {
    font-size: $px-16;
    font-weight: bold;
    color: $gray9;
  }
}

.upload-success-message {
  color: $gray7;

  .success-chk {
    font-size: $px-24;
    color: $app-dk-green;
  }

  #file-name-col {
    margin-top: 2px;
    margin-left: -46px;
  }
}

// styles common to the sections
::v-deep #court-order-poa-section {
  .v-card {
    padding: 1.5rem 1.25rem !important;
  }

  .row {
    padding: 0.75rem 0;

    .col-3 {
      font-size: $px-16;
      color: $gray9;
      padding: 0 0 0 0.75rem !important;
    }

    .col-9 {
      padding: 0 0.5rem 0 0 !important;
    }
  }
}

// styles specific to court order poa section
::v-deep #court-order-poa-section {
  .v-card {
    margin-top: 0 !important;
  }

  .row {
    margin-top: 0 !important;
  }

  .v-input--checkbox {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
}
</style>
