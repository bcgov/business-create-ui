<template>
  <div id="continuation-in-review-confirm">
    <!-- Review and Confirm -->
    <section class="mt-10">
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-4">
          Review the information in your application. If you need to change or complete anything,
          return to the step to make the necessary change.
        </p>
      </header>

      <!-- Your Business in Home Jurisdiction -->
      <v-card
        id="your-business-in-home-jurisdiction-vcard"
        flat
        class="mt-6"
      >
        <CardHeader
          icon="mdi-domain-plus"
          label="Your Business in Home Jurisdiction"
        />
        <span class="pl-6">**TODO: Change this to the proper component</span>
        <SummaryDefineCompany />
      </v-card>

      <!-- Your Business in BC -->
      <v-card
        id="your-business-in-bc-vcard"
        flat
        class="mt-6"
      >
        <CardHeader
          icon="mdi-domain"
          label="Your Business in BC"
        />
        <SummaryDefineCompany />
      </v-card>

      <!-- People and Roles -->
      <v-card
        id="people-and-roles-vcard"
        flat
        class="mt-6"
      >
        <CardHeader
          icon="mdi-account-multiple-plus"
          label="People and Roles"
        />
        <ListPeopleAndRoles :isSummary="true" />
      </v-card>

      <!-- Share Structure -->
      <v-card
        id="share-structure-vcard"
        flat
        class="mt-6"
      >
        <CardHeader
          icon="mdi-sitemap"
          label="Share Structure"
        />
        <ListShareClass
          :isSummary="true"
          :shareClasses="getCreateShareStructureStep.shareClasses"
          :showErrorSummary="!getCreateShareStructureStep.valid"
          :isContinuationInFiling="true"
        />
      </v-card>
    </section>

    <!-- Continuation Effective Date and Time -->
    <section
      id="continuation-effective-date-time-section"
      class="mt-10"
    >
      <header>
        <h2>Continuation Effective Date and Time</h2>
        <p class="mt-4">
          Select the Date and Time of incorporation for your business. You may select a date up
          to 10 days in the future (note: there is an <strong>additional fee of $100</strong> to
          enter an incorporation date in the future). Unless a business has special requirements,
          most businesses select an immediate Date and Time of Incorporation.
        </p>
      </header>

      <EffectiveDateTime
        class="mt-6"
        :class="{ 'invalid-section': isEffectiveDateTimeInvalid }"
        :effectiveDateTime="getEffectiveDateTime"
        label="Incorporation Date and Time"
        @valid="setEffectiveDateTimeValid($event)"
        @effectiveDate="setEffectiveDate($event)"
        @isFutureEffective="setIsFutureEffective($event)"
      />
    </section>

    <!-- Document Delivery -->
    <section
      id="document-delivery-section"
      class="mt-10"
    >
      <header>
        <h2>Document Delivery</h2>
        <p class="mt-4">
          Copies of the incorporation documents will be sent to the email addresses listed below.
        </p>
      </header>

      <v-card
        flat
        class="mt-6"
      >
        <DocumentDelivery
          class="py-8 px-6"
          :contactValue="getBusinessContact.email"
          :completingPartyEmail="getUserEmail"
          contactLabel="Registered Office"
        />
      </v-card>
    </section>

    <!-- Certify -->
    <section
      id="certify-section"
      class="mt-10"
    >
      <header>
        <h2>Certify</h2>
        <p class="mt-4">
          Confirm the legal name of the person authorized to complete and submit this application.
        </p>
      </header>

      <v-card
        flat
        class="mt-6"
      >
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
    <section
      v-if="isRoleStaff"
      id="staff-payment-section"
      class="mt-10"
    >
      <header>
        <h2>Staff Payment</h2>
        <p class="mt-4" />
      </header>

      <v-card
        flat
        class="mt-6"
      >
        <StaffPayment class="py-8 px-6" />
      </v-card>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ContactPointIF, CertifyIF, EffectiveDateTimeIF, ShareStructureIF } from '@/interfaces'
import CardHeader from '@/components/common/CardHeader.vue'
import Certify from '@/components/common/Certify.vue'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import EffectiveDateTime from '@/components/common/EffectiveDateTime.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import ListShareClass from '@/components/common/ListShareClass.vue'
import SummaryDefineCompany from '@/components/common/SummaryDefineCompany.vue'
import StaffPayment from '@/components/common/StaffPayment.vue'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

@Component({
  components: {
    CardHeader,
    Certify,
    DocumentDelivery,
    EffectiveDateTime,
    ListPeopleAndRoles,
    ListShareClass,
    SummaryDefineCompany,
    StaffPayment
  }
})
export default class ContinuationInReviewConfirm extends Vue {
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getCertifyState!: CertifyIF
  @Getter(useStore) getCreateShareStructureStep!: ShareStructureIF
  @Getter(useStore) getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getUserEmail!: string
  @Getter(useStore) getValidateSteps!: boolean
  @Getter(useStore) isPremiumAccount!: boolean
  @Getter(useStore) isRoleStaff!: boolean

  @Action(useStore) setCertifyState!: (x: CertifyIF) => void
  @Action(useStore) setEffectiveDate!: (x: Date) => void
  @Action(useStore) setEffectiveDateTimeValid!: (x: boolean) => void
  @Action(useStore) setHasPlanOfArrangement!: (x: boolean) => void
  @Action(useStore) setIsFutureEffective!: (x: boolean) => void

  /**
   * In case submitting the continuation in failed, we want to reset the validity of Certify.
   * This is since the checkbox has to be ticked again after the save dialog has been closed.
   */
  mounted (): void {
    this.setCertifyState({
      certifiedBy: this.getCertifyState.certifiedBy,
      valid: false
    })
  }

  /** The entity description,  */
  get getEntityDescription (): string {
    return GetCorpFullDescription(this.getEntityType)
  }

  /** Is true when the effective date-time conditions are not met. */
  get isEffectiveDateTimeInvalid (): boolean {
    return this.getValidateSteps && !this.getEffectiveDateTime.valid
  }

  /** Is true when the certify conditions are not met. */
  get isCertifyInvalid (): boolean {
    return this.getValidateSteps && !(this.getCertifyState.certifiedBy && this.getCertifyState.valid)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#continuation-in-review-confirm {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}

// override base class text size
.message-box p {
  font-size: $px-16;
}
</style>
