<template>
  <div id="dissolution-firm-form">
    <section class="mt-10">
      <!-- Dissolution summary -->
      <v-card flat id="dissolution-summary" class="mt-6">
        <header class="review-header rounded-t">
          <v-icon class="ml-2" color="appDkBlue">mdi-domain-remove</v-icon>
          <label class="font-weight-bold pl-2">Dissolution</label>
        </header>

        <div class="pb-8" >
          <!-- Association Details -->
          <section>
            <AssociationDetails
              entityLabel= "Business"
              addressLabel= "Business Address"
              :showContactInfo="false"
              :showBusinessDate="true"
              :isSummary="true"
            />
          </section>
        </div>
      </v-card>
    </section>

    <!-- Dissolution Dissolution Date -->
    <section id="document-delivery-section" class="mt-10">
      <header>
        <h2>Business Dissolution Date</h2>
        <p class="mt-4 ">
          Enter the dissolution date of the business.
          The dissolution date must be after the business start date and registration date.
          The dissolution date cannot be in the future.
        </p>
      </header>
      <v-card flat class="mt-6">

       <!-- EDIT SECTION -->
        <v-row no-gutters class="pb-0">
          <v-col cols="12" sm="3" class="pr-4">
            <label class="start-date-title title-label">Dissolution Date</label>
          </v-col>
          <v-col cols="12" sm="9" class="pt-4 pt-sm-0" id="start-date-selector">
            <date-picker
              id="date-picker"
              title="Dissolution Date"
              :nudgeRight="40"
              :nudgeTop="85"
              :minDate="startDateMinStr"
              :maxDate="startDateMaxStr"
              :inputRules="getShowErrors ? startDateRules : []"
              @emitDateSync="startDateHandler($event)"
            />
          </v-col>
        </v-row>
      </v-card>
    </section>

    <!-- Dissolution Documents Delivery -->
    <section id="document-delivery-section" class="mt-10">
      <header>
        <h2>Documents Delivery</h2>
        <p class="mt-4 mb-6">
          Copies of the dissolution documents will be sent to the email addresses listed below.
        </p>
      </header>
      <v-card flat class="mt-6">

      <DocumentDelivery
        :class="{ 'invalid-section': isDocumentDeliveryInvalid }"
        :editableCompletingParty="isRoleStaff"
        :showCustodianEmail="false"
        :invalidSection="isDocumentDeliveryInvalid"
        :contactValue="getBusinessContact.email"
        :custodianEmail="getDissolutionCustodianEmail"
        :completingPartyEmail="getUserEmail"
        :documentOptionalEmail="getDocumentDelivery.documentOptionalEmail"
        @update:optionalEmail="setDocumentOptionalEmail($event)"
        @valid="setDocumentOptionalEmailValidity($event)"
        additionalLabel="Partners"
        contactLabel="Business Contact"
      />
      <!-- SB TODO: update additionalLabel & additionalLabel (sample data)-->
      </v-card>
    </section>

    <!-- Folio or Reference Number -->
    <section id="folio-number-section" class="mt-10" v-if="isPremiumAccount">
      <header>
        <h2>Folio or Reference Number for this Filing</h2>
        <p class="mt-4 mb-6">
          Enter the folio or reference number you want to use for this filing for your own tracking
          purposes. The Business Folio or Reference Number is displayed below (if available).
          Entering a different value below will not change the Business Folio or Reference Number.
          Only the number below will appear on the transaction report and receipt for this filing.
        </p>
      </header>
       <v-card flat class="mt-6">
        <TransactionalFolioNumber
          :accountFolioNumber="getFolioNumber"
          :transactionalFolioNumber="getTransactionalFolioNumber"
          :doValidate="getValidateSteps"
          @change="setTransactionalFolioNumber($event)"
          @valid="setTransactionalFolioNumberValidity($event)"
        />
       </v-card>
    </section>

  <!-- Completing Party -->
  <!-- show only if exist -->
    <section  id="completing-party-section" class="mt-10"
    v-if="getAddPeopleAndRoleStep.orgPeople && getAddPeopleAndRoleStep.orgPeople.length > 0">
      <header>
        <h2>Completing Party</h2>

      </header>
      <v-card flat class="mt-6">
        <ListPeopleAndRoles
        :personList="getAddPeopleAndRoleStep.orgPeople"
        :isSummary="true"
        :showErrorSummary="!getAddPeopleAndRoleStep.valid"
      />
      </v-card>
    </section>

    <!-- Certify -->
    <section id="certify-section" class="mt-10">
      <header>
        <h2>Certify</h2>
        <p class="mt-4 mb-6">
          Confirm the legal name of the person authorized to complete and submit this dissolution.
        </p>
      </header>
      <v-card flat class="mt-6">
      <Certify
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
      </v-card>
    </section>

    <!-- Court Order and Plan of Arrangement -->
    <section id="court-order-poa-section" class="mt-10" v-if="isRoleStaff">
      <header>
        <h2>Court Order and Plan of Arrangement</h2>
        <p class="mt-4 mb-6">
          If this filing is pursuant to a court order, enter the court order number. If this
          filing is pursuant to a plan of arrangement, enter the court order number and select
          Plan of Arrangement.
        </p>
      </header>
      <v-card flat class="mt-6">
      <CourtOrderPoa
        id="court-order"
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
      </v-card>
    </section>

    <!-- Staff Payment -->
    <section id="staff-payment-section" class="mt-10" v-if="isRoleStaff">
      <header>
        <h2>Staff Payment</h2>
        <p class="mt-4 mb-6"></p>
      </header>
      <v-card flat class="mt-6">
      <StaffPayment />
      </v-card>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { DateMixin } from '@/mixins'
import AssociationDetails from '@/components/Dissolution/AssociationDetails.vue'
import { Certify } from '@bcrs-shared-components/certify'

import { CourtOrderPoa } from '@bcrs-shared-components/court-order-poa'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'

import { DatePicker } from '@bcrs-shared-components/date-picker'
import { RuleHelpers } from '@/rules'

import StaffPayment from '@/components/common/StaffPayment.vue'
import TransactionalFolioNumber from '@/components/common/TransactionalFolioNumber.vue'
import { RouteNames } from '@/enums'
import {
  ActionBindingIF,
  ContactPointIF,
  CertifyIF,
  CertifyStatementIF,
  CourtOrderStepIF,
  DocumentDeliveryIF,
  PeopleAndRoleIF
} from '@/interfaces'

@Component({
  components: {
    AssociationDetails,
    Certify,
    CourtOrderPoa,
    DocumentDelivery,
    StaffPayment,
    TransactionalFolioNumber,
    ListPeopleAndRoles,
    DatePicker
  }
})
export default class DissolutionFirm extends Mixins(DateMixin) {
  // Global getters
  @Getter getBusinessContact!: ContactPointIF
  @Getter getCertifyState!: CertifyIF
  @Getter getCompletingPartyStatement!: CertifyStatementIF
  @Getter getCourtOrderStep!: CourtOrderStepIF
  @Getter getCurrentDate!: string
  @Getter getDissolutionCustodianEmail!: string
  @Getter getDocumentDelivery!: DocumentDeliveryIF
  @Getter getUserEmail!: string
  @Getter getValidateSteps!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter isRoleStaff!: boolean
  @Getter getFolioNumber!: string
  @Getter getTransactionalFolioNumber!: string
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter getBusinessFoundingDate!: string

  // Global actions
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

  /** Is true when the Court Order conditions are not met. */
  get isCourtOrderInvalid (): boolean {
    return (this.getValidateSteps && !this.getCourtOrderStep.valid)
  }

  /** Is true when the Document Delivery conditions are not met. */
  get isDocumentDeliveryInvalid (): boolean {
    return (this.getValidateSteps && !this.getDocumentDelivery.valid)
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

  /** The minimum start date that can be entered (greater than registration date). */
  private get startDateMin (): Date {
    return new Date(this.getBusinessFoundingDate)
  }

  /** The minimum start date string. */
  private get startDateMinStr (): string {
    return this.dateToYyyyMmDd(this.startDateMin)
  }

  /** The maximum start date that can be entered (today). */
  private get startDateMax (): Date {
    return new Date(this.getCurrentJsDate)
  }

  /** The maximum start date string. */
  private get startDateMaxStr (): string {
    return this.dateToYyyyMmDd(this.startDateMax)
  }

  /** Validations rules for start date field. */
  get startDateRules (): Array<Function> {
    return [
      (v: string) => !!v || 'Dissolution date is required',
      (v: string) =>
        RuleHelpers.DateRuleHelpers
          .isBetweenDates(this.startDateMin,
            this.startDateMax,
            v) ||
        `Date should be between ${this.dateToPacificDate(this.startDateMin, true)} and
        ${this.dateToPacificDate(this.startDateMax, true)}`
    ]
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#dissolution-firm-form {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}

#dissolution-summary .v-divider {
  background-color: $gray1;
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

#effective-date-text {
  color: $gray7;
}

// FUTURE: this should be under court-order-poa-section below
 #court-order {
  .row {
    .col-9 {
      padding-left: 1rem !important;
    }
  }

  #court-order-label, #poa-label {
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
#document-delivery-section,
#folio-number-section,
#certify-section,
#court-order-poa-section,
#staff-payment-section {
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

// styles specific to certify section
#certify-section {

  .v-input--checkbox .v-input__slot {
    align-items: flex-start;
  }

  // bring the main label down a bit to line up with text-field
  .row:first-of-type .col:first-of-type {
    padding-top: 8px !important;
  }

  .v-input--checkbox {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  .certify-clause:last-of-type {
    margin-bottom: 0 !important;
  }
}

// styles specific to court order poa section
#court-order-poa-section {
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

// styles specific to staff payment section
#staff-payment-section {
  .v-card {
    margin-top: 0 !important;
    border-radius: 4px !important;
  }

  .v-input__slot {
    margin-bottom: 0 !important;
  }

  .v-input--checkbox {
    margin-top: 0 !important;

    .v-messages {
      margin-bottom: -14px !important;
    }
  }

  .v-messages__message {
    padding-top: .5rem !important;
  }
}
</style>
