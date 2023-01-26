<template>
  <div id="registration-review-confirm">
    <!-- Review and Confirm -->
    <section id="review-and-confirm-section" class="mt-10">
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-4">
          Review the information in your registration. If you need to change or complete anything,
          return to the step to make the necessary change.
        </p>
      </header>

      <!-- Your Business -->
      <v-card id="your-business-vcard" flat class="mt-6">
        <CardHeader icon="mdi-domain" label="Your Business" />
        <DefineRegistrationSummary />
      </v-card>

      <!-- People and Roles -->
      <v-card id="people-and-roles-vcard" flat class="mt-6">
        <CardHeader icon="mdi-account-multiple-plus" label="People and Roles" />
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
          :contactLabel="'Business Office'"
          :contactValue="getBusinessContact.email"
          :editableCompletingParty="isRoleStaff || isSbcStaff"
          :completingPartyEmail="getUserEmail"
          :additionalLabel="documentDeliveryAdditionalLabel"
          :additionalValue="documentDeliveryAdditionalValue"
          :invalidSection="isDocumentDeliveryInvalid"
          @valid="setDocumentOptionalEmailValidity($event)"
        />
      </v-card>
    </section>

    <!-- Transactional Folio Number -->
    <section id="folio-section" class="mt-10" v-if="isPremiumAccount">
      <header>
        <h2>Folio or Reference Number for this Filing</h2>
        <p class="mt-4">
          Enter the folio or reference number you want to use for this filing for your own tracking purposes.
          The Business Folio or Reference Number is displayed below (if available).
          Entering a different value below will not change the Business Folio or Reference Number.
          Only the number below will appear on the transaction report and receipt for this filing.
        </p>
      </header>

      <v-card flat class="mt-6">
        <TransactionalFolioNumber
          class="py-8 px-6"
          :accountFolioNumber="getFolioNumber"
          :transactionalFolioNumber="getTransactionalFolioNumber"
          :doValidate="getValidateSteps"
          @change="setTransactionalFolioNumber($event)"
          @valid="setTransactionalFolioNumberValidity($event)"
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

    <template v-if="isRoleStaff">
      <!-- Staff Payment -->
      <section id="staff-payment-section" class="mt-10">
        <header>
          <h2>Staff Payment</h2>
          <p class="mt-4"></p>
        </header>

        <v-card flat class="mt-6">
          <StaffPayment class="py-8 px-6" />
        </v-card>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, ContactPointIF, CertifyIF, DocumentDeliveryIF, PeopleAndRoleIF } from '@/interfaces'
import { RoleTypes } from '@/enums'
import CardHeader from '@/components/common/CardHeader.vue'
import Certify from '@/components/common/Certify.vue'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import StaffPayment from '@/components/common/StaffPayment.vue'
import DefineRegistrationSummary from '@/components/Registration/DefineRegistrationSummary.vue'
import FeeAcknowledgement from '@/components/Registration/FeeAcknowledgement.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import TransactionalFolioNumber from '@/components/common/TransactionalFolioNumber.vue'

@Component({
  components: {
    CardHeader,
    Certify,
    DefineRegistrationSummary,
    DocumentDelivery,
    FeeAcknowledgement,
    ListPeopleAndRoles,
    StaffPayment,
    TransactionalFolioNumber
  }
})
export default class RegistrationReviewConfirm extends Vue {
  @Getter getBusinessContact!: ContactPointIF
  @Getter getUserEmail!: string
  @Getter getFolioNumber!: string
  @Getter getTransactionalFolioNumber!: string
  @Getter isPremiumAccount!: boolean
  @Getter getCertifyState!: CertifyIF
  @Getter isRoleStaff!: boolean
  @Getter isSbcStaff!: boolean
  @Getter getValidateSteps!: boolean
  @Getter getDocumentDelivery!: DocumentDeliveryIF
  @Getter isTypeSoleProp!: boolean
  @Getter isTypePartnership!: boolean
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF

  @Action setDocumentOptionalEmailValidity!: ActionBindingIF
  @Action setTransactionalFolioNumber!: ActionBindingIF
  @Action setTransactionalFolioNumberValidity!: ActionBindingIF

  /** The Document Delivery additional email label. */
  get documentDeliveryAdditionalLabel (): string {
    if (this.isTypeSoleProp) return 'Proprietor'
    if (this.isTypePartnership) return 'Partners'
    return null
  }

  /** The Document Delivery additional email value. */
  get documentDeliveryAdditionalValue (): string {
    const orgPersonList = this.getAddPeopleAndRoleStep.orgPeople

    if (this.isTypeSoleProp) {
      const emails = orgPersonList
        .filter(op => op.roles.some(role => role.roleType === RoleTypes.PROPRIETOR))
        .map(op => op.officer?.email)
        .filter(e => !!e)
      return emails.join(', ')
    }
    if (this.isTypePartnership) {
      const emails = orgPersonList
        .filter(op => op.roles.some(role => role.roleType === RoleTypes.PARTNER))
        .map(op => op.officer?.email)
        .filter(e => !!e)
      return emails.join(', ')
    }
    return null
  }

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
</style>
