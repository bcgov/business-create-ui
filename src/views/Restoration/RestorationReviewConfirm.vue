<template>
  <div id="restoration-review-confirm">
    <!-- Review and Confirm -->
    <section class="mt-10">
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-4">
          Review the information in your application. If you need to change or complete anything,
          return to the step to make the necessary change.
          </p>
      </header>

      <!-- Applicant Information -->
      <v-card id="people-and-roles-vcard" flat class="mt-6">
        <CardHeader icon="mdi-account-multiple-plus" label="Applicant Information" />
        <ListPeopleAndRoles
          :isSummary="true"
          :showDeliveryAddressColumn="!isFullRestorationFiling && !isLimitedRestorationFiling"
          :showRolesColumn="!isFullRestorationFiling && !isLimitedRestorationFiling"
          :showEmailColumn="isFullRestorationFiling || isLimitedRestorationFiling"
        />
      </v-card>

      <!-- Business Information -->
      <v-card id="company-summary-vcard" flat class="mt-6">
        <CardHeader icon="mdi-domain" label="Business Information" />
        <SummaryBusinessInformation />
      </v-card>
    </section>

    <!-- Document Delivery -->
    <section id="document-delivery-section" class="mt-10">
      <header>
        <h2>Document Delivery</h2>
        <p class="mt-4">
          Copies of the restoration documents will be sent to the email addresses listed below.
        </p>
      </header>

      <v-card flat class="mt-6">
        <DocumentDelivery
          class="py-8 px-6"
          contactLabel="Business Office"
          :contactValue="businessOfficeEmail"
          additionalLabel="Applicant"
          :additionalValue="applicantEmail"
          :showCompletingParty="false"
        />
      </v-card>
    </section>

    <!-- Certify -->
    <section id="certify-section" class="mt-10">
      <header>
        <h2>Certify</h2>
        <p class="mt-4">
          Confirm the legal name of the person authorized to complete and submit this application.
        </p>
      </header>

      <v-card flat class="mt-6">
        <Certify
          class="py-8 px-6"
          :class="{ 'invalid-section': isCertifyInvalid }"
          :disableEdit="!isRoleStaff"
          :invalidSection="isCertifyInvalid"
          :isStaff="isRoleStaff"
        />
      </v-card>
    </section>

    <!-- Staff Payment -->
    <section id="staff-payment-section" class="mt-10" v-if="isRoleStaff">
      <header>
        <h2>Staff Payment</h2>
        <p class="mt-4"></p>
      </header>

      <v-card flat class="mt-6">
        <StaffPayment class="py-8 px-6" />
      </v-card>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, CertifyIF, ContactPointIF, CourtOrderStepIF, EffectiveDateTimeIF,
  IncorporationAgreementIF, PeopleAndRoleIF, ShareStructureIF } from '@/interfaces'
import { CorpTypeCd, RoleTypes } from '@/enums'
import CardHeader from '@/components/common/CardHeader.vue'
import Certify from '@/components/common/Certify.vue'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import SummaryBusinessInformation from '@/components/Restoration/SummaryBusinessInformation.vue'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import StaffPayment from '@/components/common/StaffPayment.vue'

@Component({
  components: {
    CardHeader,
    Certify,
    DocumentDelivery,
    ListPeopleAndRoles,
    StaffPayment,
    SummaryBusinessInformation
  }
})
export default class RestorationReviewConfirm extends Vue {
  @Getter getBusinessContact!: ContactPointIF
  @Getter getCertifyState!: CertifyIF
  @Getter getValidateSteps!: boolean
  @Getter isRoleStaff!: boolean
  @Getter getUserEmail!: string
  @Getter getEntityType!: CorpTypeCd
  @Getter isFullRestorationFiling!: boolean
  @Getter isLimitedRestorationFiling!: boolean
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF

  @Action setCertifyState!: ActionBindingIF

  /** The entity description,  */
  get getEntityDescription (): string {
    return GetCorpFullDescription(this.getEntityType)
  }

  get businessOfficeEmail (): string {
    return this.getBusinessContact.email
  }

  get applicantEmail (): string {
    const orgPeople = this.getAddPeopleAndRoleStep.orgPeople
    const applicants = orgPeople.filter(
      orgPerson => orgPerson.roles.some(role => role.roleType === RoleTypes.APPLICANT)
    )
    return applicants[0]?.officer.email
  }

  /** Is true when the certify conditions are not met. */
  get isCertifyInvalid (): boolean {
    return this.getValidateSteps && !(this.getCertifyState.certifiedBy && this.getCertifyState.valid)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#restoration-review-confirm {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}
</style>
