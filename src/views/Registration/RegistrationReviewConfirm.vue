<template>
  <div id="registration-review-confirm">
    <!-- Review and Confirm -->
    <section id="review-and-confirm-section" class="mt-10">
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-4 mb-6">
          Review the information in your registration. If you need to change or complete anything, return
          to the step to make the necessary change.
        </p>
      </header>
      <DefineRegistrationSummary class="mt-6" />
      <ListPeopleAndRoles
        :personList="getAddPeopleAndRoleStep.orgPeople"
        :isSummary="true"
        :showErrorSummary="!getAddPeopleAndRoleStep.valid"
      />
    </section>

    <!-- Document Delivery -->
    <section id="document-delivery-section" class="mt-10">
      <header>
        <h2>Document Delivery</h2>
        <p class="mt-4 mb-6">
          Copies of the registration documents will be sent to the email addresses listed below.
        </p>
      </header>
      <DocumentDelivery
        :registeredOfficeEmail="getBusinessContact.email"
        :completingPartyEmail="getUserEmail"
      />
    </section>

    <!-- Certify -->
    <section id="certify-section" class="mt-10">
      <header>
        <h2>Certify</h2>
        <p class="mt-4 mb-6">
          Confirm the legal name of the person authorized to complete and submit this registration.
        </p>
      </header>
      <Certify
        :class="{ 'invalid-section': isCertifyInvalid }"
        :currentDate="getCurrentDate"
        :certifiedBy="getCertifyState.certifiedBy"
        :entityDisplay="getCompletingPartyStatement.entityDisplay + ' applicant'"
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

    <!-- Fee Acknowledgement-->
    <!-- COMMENTED OUT FOR NOW, PER LINDA -->
    <!-- <section id="fee-acknowledgement-section" class="mt-10">
      <header>
        <h2>Fee Acknowledgement</h2>
        <p class="mt-4 mb-6"></p>
      </header>
      <FeeAcknowledgement />
    </section> -->

    <!-- Staff Payment -->
    <section id="staff-payment-section" class="mt-10" v-if="isRoleStaff">
      <header>
        <h2>Staff Payment</h2>
        <p class="mt-4 mb-6"></p>
      </header>
      <StaffPayment />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import {
  ActionBindingIF, BusinessContactIF, CertifyIF, CertifyStatementIF, PeopleAndRoleIF, RegistrationStateIF
} from '@/interfaces'
import { Certify } from '@bcrs-shared-components/certify'
import DefineRegistrationSummary from '@/components/Registration/DefineRegistrationSummary.vue'
import DocumentDelivery from '@/components/common/DocumentDelivery.vue'
import StaffPayment from '@/components/common/StaffPayment.vue'
import FeeAcknowledgement from '@/components/Registration/FeeAcknowledgement.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'

@Component({
  components: {
    Certify,
    DefineRegistrationSummary,
    DocumentDelivery,
    FeeAcknowledgement,
    ListPeopleAndRoles,
    StaffPayment
  }
})
export default class RegistrationReviewConfirm extends Vue {
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getCompletingPartyStatement!: CertifyStatementIF
  @Getter getCurrentDate!: string
  @Getter getUserEmail!: string
  @Getter getCertifyState!: CertifyIF
  @Getter isRoleStaff!: boolean
  @Getter getValidateSteps!: boolean
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF

  @Action setCertifyState!: ActionBindingIF

  /** Is true when the certify conditions are not met. */
  get isCertifyInvalid () {
    return this.getValidateSteps && (!this.getCertifyState.certifiedBy || !this.getCertifyState.valid)
  }

  /** Handler for CertifiedBy change event. */
  onCertifiedBy (val: string): void {
    this.setCertifyState(
      {
        valid: this.getCertifyState.valid,
        certifiedBy: val
      }
    )
  }

  /** Handler for Valid change event. */
  onIsCertified (val: boolean): void {
    this.setCertifyState(
      {
        valid: val,
        certifiedBy: this.getCertifyState.certifiedBy
      }
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#registration-review-confirm {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}

// styles common to the sections
::v-deep #document-delivery-section,
::v-deep #certify-section,
::v-deep #fee-acknowledgement-section,
::v-deep #staff-payment-section {
  .v-card {
    padding: 1.5rem 1.25rem !important;
  }

  .row {
    padding: 0.75rem 0;

    .col-3 {
      font-size: $px-14;
      color: $gray9;
      padding: 0 0 0 0.75rem !important;
    }

    .col-9 {
      padding: 0 0.5rem 0 0 !important;
    }
  }
}

// styles specific to review and confirm section
#review-and-confirm-section {
  margin-top: 1rem;

  ::v-deep .v-card {
    margin-top: 30px !important;
    border-radius: 0px !important;

    .review-header {
      border-radius: 4px 4px 0px 0px !important;
    }
  }
}

// styles specific to document delivery section
::v-deep #document-delivery-section {
  label {
    font-size: $px-16;
  }
}

// styles specific to certify section
::v-deep #certify-section {
  .v-card {
    margin-top: 0 !important;
  }

  .v-form {
    margin-top: 0 !important;
  }

  .container {
    padding: 0 !important;
  }

  label {
    font-size: $px-16;
  }

  .v-input--checkbox .v-input__slot {
    align-items: flex-start;
  }

  .row {
    padding: 0.75rem 0 !important;
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

// styles specific to staff payment section
::v-deep #staff-payment-section {
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
