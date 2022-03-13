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

      <!-- Your Business -->
      <v-card flat class="mt-6">
        <header class="v-card-header rounded-t">
          <v-icon color="appDkBlue">mdi-domain</v-icon>
          <label class="v-card-label pl-2"><strong>Your Business</strong></label>
        </header>
        <DefineRegistrationSummary />
      </v-card>

      <!-- People and Roles -->
      <v-card flat class="mt-10">
        <header class="v-card-header rounded-t">
          <v-icon color="appDkBlue">mdi-account-multiple-plus</v-icon>
          <label class="v-card-label pl-2">People and Roles</label>
        </header>
        <ListPeopleAndRoles :isSummary="true" />
      </v-card>
    </section>

    <!-- Document Delivery -->
    <section id="document-delivery-section" class="mt-10">
      <header>
        <h2>Document Delivery</h2>
        <p class="mt-4">
          Copies of the registration documents will be sent to the email addresses listed below.
        </p>
      </header>
      <v-card flat class="mt-6">
        <DocumentDelivery
          class="py-8 px-6"
          :class="{ 'invalid-section': isDocumentDeliveryInvalid }"
          :editableCompletingParty="isRoleStaff || isSbcStaff"
          :registeredOfficeEmail="getBusinessContact.email"
          :completingPartyEmail="getUserEmail"
          :invalidSection="isDocumentDeliveryInvalid"
          @valid="setDocumentOptionalEmailValidity($event)"
        />
      </v-card>
    </section>

    <!-- Certify -->
    <section id="certify-section" class="mt-10">
      <header>
        <h2>Certify</h2>
        <p class="mt-4">
          Confirm the legal name of the person authorized to complete and submit this registration.
        </p>
      </header>
      <v-card flat class="mt-6">
        <Certify
          class="py-8 px-6"
          :class="{ 'invalid-section': isCertifyInvalid }"
          :disableEdit="!isRoleStaff && !isSbcStaff"
          :invalidSection="isCertifyInvalid"
          :isStaff="isRoleStaff || isSbcStaff"
        />
      </v-card>
    </section>

    <!-- Fee Acknowledgement-->
    <!-- COMMENTED OUT FOR NOW, PER LINDA -->
    <!-- <section id="fee-acknowledgement-section" class="mt-10">
      <header>
        <h2>Fee Acknowledgement</h2>
        <p class="mt-4"></p>
      </header>
      <v-card flat class="mt-6">
        <FeeAcknowledgement
          class="py-8 px-6"
          :class="{ 'invalid-section': isDocumentDeliveryInvalid }"
        />
      </v-card>
    </section> -->

    <!-- Staff Payment -->
    <section id="staff-payment-section" class="mt-10" v-if="isRoleStaff">
      <header>
        <h2>Staff Payment</h2>
        <p class="mt-4"></p>
      </header>
      <v-card flat class="mt-6">
        <StaffPayment
          class="py-8 px-6"
        />
      </v-card>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, BusinessContactIF, CertifyIF, DocumentDeliveryIF } from '@/interfaces'
import Certify from '@/components/common/Certify.vue'
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
  @Getter getUserEmail!: string
  @Getter getCertifyState!: CertifyIF
  @Getter isRoleStaff!: boolean
  @Getter getValidateSteps!: boolean
  @Getter getDocumentDelivery!: DocumentDeliveryIF
  @Getter isSbcStaff!: boolean

  @Action setDocumentOptionalEmailValidity!: ActionBindingIF

  /** Is true when the Document Delivery conditions are not met. */
  get isDocumentDeliveryInvalid (): boolean {
    return (this.getValidateSteps && !this.getDocumentDelivery.valid)
  }

  /** Is true when the certify conditions are not met. */
  get isCertifyInvalid (): boolean {
    return this.getValidateSteps && !(this.getCertifyState.certifiedBy && this.getCertifyState.valid)
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

.v-card-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .v-card-label {
    font-weight: bold;
    color: $gray9;
  }
}
</style>
