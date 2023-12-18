<template>
  <div id="amalgamation-regular-review-confirm">
    <!-- Review and Confirm -->
    <section class="mt-10">
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-4">
          Review the information in your application. If you need to change or complete anything,
          return to the step to make the necessary change.
        </p>
      </header>

      <!-- Amalgamation Information -->
      <v-card
        id="company-summary-vcard"
        flat
        class="mt-6"
      >
        <CardHeader
          icon="mdi-domain-plus"
          :label="getFilingName"
        />
        <SummaryDefineCompany />
      </v-card>

      <!-- Amalgamating Businesses Information -->
      <v-card
        id="people-and-roles-vcard"
        flat
        class="mt-6"
      >
        <CardHeader
          icon="mdi-domain"
          label="Amalgamating Businesses Information"
        />
        <div
          class="pa-4"
          :class="{ 'invalid-section': !getAmalgamatingBusinessesValid }"
        >
          <BusinessTableSummary />
        </div>
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
          :isAmalgamationFiling="true"
        />
      </v-card>
    </section>

    <!-- Amalgamation Date and Time -->
    <section
      id="amalgamation-date-time-section"
      class="mt-10"
    >
      <header>
        <h2>Amalgamation Date and Time</h2>
        <p class="mt-4">
          Select the Date and Time of amalgamation for your business. You may select a date up
          to 10 days in the future (note: there is an <strong>additional fee of $100</strong> to
          enter an amalgamation date in the future). Unless a business has special requirements,
          most businesses select an immediate Date and Time of Amalgamation.
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

    <!-- Folio or Reference Number -->
    <section
      id="folio-number-section"
      class="mt-10"
    >
      <header>
        <h2>Folio or Reference Number for this Filing</h2>
        <p class="mt-4">
          Enter the folio or reference number you want to use for this filing for you own tracking purposes. The
          Business Folio or Reference Number is displayed below (if available). Entering a different value below will
          not change the Business Folio or Reference Number. Only the number below will appear on the transaction report
          and receipt for this filing.
        </p>
      </header>

      <v-card
        flat
        class="mt-6"
      >
        <div class="pa-4">
          <FolioNumber
            :initialValue="getFolioNumber"
            :isEditing="true"
            :folioNumberLabel="true"
            @update="setFolioNumber($event)"
            @valid="setFolioNumberValidity($event)"
          />
        </div>
      </v-card>
    </section>

    <!-- Amalgamation Statement -->
    <section
      id="amalgamation-statement-section"
      class="mt-10"
    >
      <header>
        <h2>Amalgamation Statement</h2>
        <p class="mt-4">
          [*** TODO: blurb ***]
        </p>
      </header>

      <v-card
        flat
        class="mt-6"
      >
        <div class="pa-4">
          [*** TODO: Amalgamation Statement component ***]
        </div>
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

    <!-- Court Order and Plan of Arrangement -->
    <!-- <section
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
    </section> -->

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
import { ContactPointIF, CertifyIF, EffectiveDateTimeIF, IncorporationAgreementIF, ShareStructureIF,
  CourtOrderStepIF } from '@/interfaces'
import CardHeader from '@/components/common/CardHeader.vue'
import Certify from '@/components/common/Certify.vue'
import { CourtOrderPoa } from '@bcrs-shared-components/court-order-poa'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import FolioNumber from '@/components/common/FolioNumber.vue'
import BusinessTableSummary from '@/components/Amalgamation/BusinessTableSummary.vue'
import IncorporationDateTime from '@/components/Incorporation/IncorporationDateTime.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import ListShareClass from '@/components/common/ListShareClass.vue'
import SummaryDefineCompany from '@/components/common/SummaryDefineCompany.vue'
import StaffPayment from '@/components/common/StaffPayment.vue'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { FilingNames } from '@bcrs-shared-components/enums'

@Component({
  components: {
    BusinessTableSummary,
    CardHeader,
    Certify,
    CourtOrderPoa,
    DocumentDelivery,
    FolioNumber,
    IncorporationDateTime,
    ListPeopleAndRoles,
    ListShareClass,
    SummaryDefineCompany,
    StaffPayment
  }
})
export default class AmalgamationRegularReviewConfirm extends Vue {
  @Getter(useStore) getAmalgamatingBusinessesValid!: boolean
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getCertifyState!: CertifyIF
  @Getter(useStore) getCourtOrderStep!: CourtOrderStepIF
  @Getter(useStore) getCreateShareStructureStep!: ShareStructureIF
  @Getter(useStore) getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getFilingName!: FilingNames
  @Getter(useStore) getFolioNumber!: string
  @Getter(useStore) getIncorporationAgreementStep!: IncorporationAgreementIF
  @Getter(useStore) getUserEmail!: string
  @Getter(useStore) getValidateSteps!: boolean
  @Getter(useStore) isRoleStaff!: boolean

  @Action(useStore) setCertifyState!: (x: CertifyIF) => void
  @Action(useStore) setCourtOrderFileNumber!: (x: string) => void
  @Action(useStore) setCourtOrderValidity!: (x: boolean) => void
  @Action(useStore) setEffectiveDate!: (x: Date) => void
  @Action(useStore) setEffectiveDateTimeValid!: (x: boolean) => void
  @Action(useStore) setFolioNumber!: (x: string) => void
  @Action(useStore) setFolioNumberValidity!: (x: boolean) => void
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

#amalgamation-regular-review-confirm {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}
</style>
