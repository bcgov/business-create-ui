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

      <v-card id="company-summary-vcard" flat class="mt-6">
        <CardHeader icon="mdi-domain" :label="getCompanyDisplayName" />
        <SummaryDefineCompany />
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
          Copies of the incorporation documents will be sent to the email addresses listed below.
        </p>
      </header>

      <v-card flat class="mt-6">
        <DocumentDelivery
          class="py-8 px-6"
          :contactValue="getBusinessContact.email"
          :completingPartyEmail="getUserEmail"
          contactLabel="Registered Office"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, ContactPointIF, CertifyIF, EffectiveDateTimeIF, IncorporationAgreementIF,
  ShareStructureIF, CourtOrderStepIF } from '@/interfaces'
import { CorpTypeCd } from '@/enums'
import CardHeader from '@/components/common/CardHeader.vue'
import Certify from '@/components/common/Certify.vue'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import SummaryDefineCompany from '@/components/Incorporation/SummaryDefineCompany.vue'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

@Component({
  components: {
    CardHeader,
    Certify,
    DocumentDelivery,
    ListPeopleAndRoles,
    SummaryDefineCompany
  }
})
export default class RestorationReviewConfirm extends Vue {
  @Getter getBusinessContact!: ContactPointIF
  @Getter getCertifyState!: CertifyIF
  @Getter getValidateSteps!: boolean
  @Getter isRoleStaff!: boolean
  @Getter getUserEmail!: string
  @Getter getCompanyDisplayName!: string
  @Getter getEntityType!: CorpTypeCd

  @Action setCertifyState!: ActionBindingIF

  /** The entity description,  */
  get getEntityDescription (): string {
    return GetCorpFullDescription(this.getEntityType)
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