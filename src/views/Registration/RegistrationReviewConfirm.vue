<template>
  <div id="registration-review-confirm">
    <!-- Review and Confirm -->
    <section id="review-and-confirm-section" class="mt-10">
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-4">
          Review the information in your registration. If you need to change or complete anything, return
          to the step to make the necessary change.
        </p>
      </header>
      <DefineRegistrationSummary class="mt-6" />
      <ListPeopleAndRoles
        class="mt-10"
        :personList="getAddPeopleAndRoleStep.orgPeople"
        :isSummary="true"
        :showErrorSummary="!getAddPeopleAndRoleStep.valid"
      />
    </section>

    <!-- Document Delivery -->
    <section id="document-delivery-section" class="mt-10">
      <header>
        <h2>Document Delivery</h2>
        <p class="mt-4">
          Copies of the registration documents will be sent to the email addresses listed below.
        </p>
      </header>
      <DocumentDelivery
        class="mt-6"
        :class="{ 'invalid-section': isDocumentDeliveryInvalid }"
        :editableCompletingParty="isRoleStaff || isSbcStaff"
        :registeredOfficeEmail="getBusinessContact.email"
        :completingPartyEmail="getUserEmail"
        :invalidSection="isDocumentDeliveryInvalid"
        @valid="setDocumentOptionalEmailValidity($event)"
      />
    </section>

    <!-- Certify -->
    <section id="certify-section" class="mt-10">
      <header>
        <h2>Certify</h2>
        <p class="mt-4">
          Confirm the legal name of the person authorized to complete and submit this registration.
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
        :isStaff="isRoleStaff || isSbcStaff"
        :firstColumn="3"
        :secondColumn="9"
        :invalidSection="isCertifyInvalid"
        :disableEdit="!isRoleStaff && !isSbcStaff"
        @update:certifiedBy="onCertifiedBy($event)"
        @update:isCertified="onIsCertified($event)"
      />
    </section>

    <!-- Fee Acknowledgement-->
    <!-- COMMENTED OUT FOR NOW, PER LINDA -->
    <!-- <section id="fee-acknowledgement-section" class="mt-10">
      <header>
        <h2>Fee Acknowledgement</h2>
        <p class="mt-4"></p>
      </header>
      <FeeAcknowledgement class="mt-6" />
    </section> -->

    <!-- Staff Payment -->
    <section id="staff-payment-section" class="mt-10" v-if="isRoleStaff">
      <header>
        <h2>Staff Payment</h2>
        <p class="mt-4"></p>
      </header>
      <StaffPayment class="mt-6" />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import {
  ActionBindingIF, BusinessContactIF, CertifyIF, CertifyStatementIF, DocumentDeliveryIF, PeopleAndRoleIF
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
  @Getter getDocumentDelivery!: DocumentDeliveryIF
  @Getter isSbcStaff!: boolean

  @Action setCertifyState!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF

  /** Is true when the Document Delivery conditions are not met. */
  get isDocumentDeliveryInvalid (): boolean {
    return (this.getValidateSteps && !this.getDocumentDelivery.valid)
  }

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
</style>
