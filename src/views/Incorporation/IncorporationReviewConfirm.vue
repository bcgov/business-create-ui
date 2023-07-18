<template>
  <div id="incorporation-review-confirm">
    <!-- Review and Confirm -->
    <section class="mt-10">
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-4">
          Review the information in your application. If you need to change or complete anything,
          return to the step to make the necessary change.
        </p>
      </header>

      <v-card
        id="company-summary-vcard"
        flat
        class="mt-6"
      >
        <CardHeader
          icon="mdi-domain"
          :label="getCompanyDisplayName"
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
      <template v-if="isBaseCompany">
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
          />
        </v-card>
      </template>

      <!-- Agreement Type -->
      <template v-if="isBaseCompany">
        <v-card
          id="agreement-type-vcard"
          flat
          class="mt-6"
        >
          <CardHeader
            icon="mdi-handshake"
            :label="`Incorporation Agreement and ${getEntityDescription} Articles`"
          />
          <AgreementType
            :isSummary="true"
            :showErrorSummary="!getIncorporationAgreementStep.valid"
          />
        </v-card>
      </template>

      <!-- Rules -->
      <template v-if="isTypeCoop">
        <v-card
          id="rules-vcard"
          flat
          class="mt-6"
        >
          <CardHeader
            icon="mdi-format-list-text"
            label="Rules"
          />
          <UploadRulesSummary />
        </v-card>
      </template>

      <!-- Memorandum -->
      <template v-if="isTypeCoop">
        <v-card
          id="memorandum-vcard"
          flat
          class="mt-6"
        >
          <CardHeader
            icon="mdi-text-box-multiple"
            label="Memorandum"
          />
          <UploadMemorandumSummary />
        </v-card>
      </template>
    </section>

    <template v-if="isBaseCompany">
      <!-- Incorporation Date and Time -->
      <section
        id="incorporation-date-time-section"
        class="mt-10"
      >
        <header>
          <h2>Incorporation Date and Time</h2>
          <p class="mt-4">
            Select the Date and Time of incorporation for your business. You may select a date up
            to 10 days in the future (note: there is an <strong>additional fee of $100</strong> to
            enter an incorporation date in the future). Unless a business has special requirements,
            most businesses select an immediate Date and Time of Incorporation.
          </p>
        </header>

        <IncorporationDateTime
          class="mt-6"
          :class="{ 'invalid-section': isEffectiveDateTimeInvalid }"
          :effectiveDateTime="getEffectiveDateTime"
          @valid="setEffectiveDateTimeValid($event)"
          @effectiveDate="setEffectiveDate($event)"
          @isFutureEffective="setIsFutureEffective($event)"
        />
      </section>
    </template>

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
          :disableEdit="!isRoleStaff && isTypeCoop"
          :invalidSection="isCertifyInvalid"
          :isStaff="isRoleStaff"
        />
      </v-card>
    </section>

    <!-- Court Order and Plan of Arrangement -->
    <section
      v-if="isBaseCompany"
      id="court-order-poa-section"
      class="mt-10"
    >
      <header>
        <h2>Court Order and Plan of Arrangement</h2>
        <p class="mt-4">
          If this filing is pursuant to a court order, enter the court order number. If this
          filing is pursuant to a plan of arrangement, enter the court order number and select
          Plan of Arrangement.
        </p>
      </header>

      <v-card
        flat
        class="mt-6"
      >
        <CourtOrderPoa
          class="py-8 px-6"
          :class="{ 'invalid-section': isCourtOrderInvalid }"
          :draftCourtOrderNumber="getCourtOrderStep.courtOrder.fileNumber"
          :hasDraftPlanOfArrangement="getCourtOrderStep.courtOrder.hasPlanOfArrangement"
          :courtOrderNumberRequired="false"
          :invalidSection="isCourtOrderInvalid"
          @emitCourtNumber="setCourtOrderFileNumber($event)"
          @emitPoa="setHasPlanOfArrangement($event)"
          @emitValid="setCourtOrderValidity($event)"
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
import { ContactPointIF, CertifyIF, EffectiveDateTimeIF, IncorporationAgreementIF,
  ShareStructureIF, CourtOrderStepIF } from '@/interfaces'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'
import AgreementType from '@/components/common/AgreementType.vue'
import CardHeader from '@/components/common/CardHeader.vue'
import Certify from '@/components/common/Certify.vue'
import { CourtOrderPoa } from '@bcrs-shared-components/court-order-poa'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import IncorporationDateTime from '@/components/Incorporation/IncorporationDateTime.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import ListShareClass from '@/components/Incorporation/ListShareClass.vue'
import SummaryDefineCompany from '@/components/Incorporation/SummaryDefineCompany.vue'
import UploadMemorandumSummary from '@/components/Incorporation/UploadMemorandumSummary.vue'
import UploadRulesSummary from '@/components/Incorporation/UploadRulesSummary.vue'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import StaffPayment from '@/components/common/StaffPayment.vue'

@Component({
  components: {
    AgreementType,
    CardHeader,
    Certify,
    CourtOrderPoa,
    DocumentDelivery,
    IncorporationDateTime,
    ListPeopleAndRoles,
    ListShareClass,
    SummaryDefineCompany,
    UploadMemorandumSummary,
    UploadRulesSummary,
    StaffPayment
  }
})
export default class IncorporationReviewConfirm extends Vue {
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getCertifyState!: CertifyIF
  @Getter(useStore) getCompanyDisplayName!: string
  @Getter(useStore) getCourtOrderStep!: CourtOrderStepIF
  @Getter(useStore) getCreateShareStructureStep!: ShareStructureIF
  @Getter(useStore) getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getIncorporationAgreementStep!: IncorporationAgreementIF
  @Getter(useStore) getUserEmail!: string
  @Getter(useStore) getValidateSteps!: boolean
  @Getter(useStore) isBaseCompany!: boolean
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) isTypeBcUlcCompany!: boolean
  @Getter(useStore) isTypeCoop!: boolean

  @Action(useStore) setCertifyState!: (x: CertifyIF) => void
  @Action(useStore) setCourtOrderFileNumber!: (x: string) => void
  @Action(useStore) setCourtOrderValidity!: (x: boolean) => void
  @Action(useStore) setEffectiveDate!: (x: Date) => void
  @Action(useStore) setEffectiveDateTimeValid!: (x: boolean) => void
  @Action(useStore) setHasPlanOfArrangement!: (x: boolean) => void
  @Action(useStore) setIsFutureEffective!: (x: boolean) => void

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

  /** Is true when the Court Order conditions are not met. */
  get isCourtOrderInvalid (): boolean {
    return (this.getValidateSteps && !this.getCourtOrderStep.valid)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#incorporation-review-confirm {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}
</style>
