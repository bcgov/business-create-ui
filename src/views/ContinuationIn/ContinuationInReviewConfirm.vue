<template>
  <div id="continuation-in-review-confirm">
    <!-- Review and Confirm -->
    <section
      id="review-and-confirm-section"
      class="mt-10"
    >
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-4">
          Review the information in your application. If you need to change or complete anything,
          return to the step to make the necessary change.
        </p>
      </header>

      <!-- Extraprovincial Registration in B.C. -->
      <v-card
        v-if="isExpro"
        id="extraprovincial-registration-bc-vcard"
        flat
        class="mt-6"
      >
        <CardHeader
          icon="mdi-domain"
          label="Extraprovincial Registration in B.C."
        />
        <SummaryExtraprovincialRegistration />
      </v-card>

      <!-- Your Business in Previous Jurisdiction -->
      <v-card
        id="your-business-in-previous-jurisdiction-vcard"
        flat
        class="mt-6"
      >
        <CardHeader
          icon="mdi-home-city-outline"
          label="Your Business in Previous Jurisdiction"
        />
        <SummaryBusinessPreviousJurisdiction />
      </v-card>

      <!-- Your Business in B.C. -->
      <v-card
        id="your-business-in-bc-vcard"
        flat
        class="mt-6"
      >
        <CardHeader
          icon="mdi-domain"
          label="Your Business in B.C."
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
          Select the effective date and time of continuation. You may pay
          <strong>an additional fee of $100</strong>
          to select a date up to 10 days in the future. Unless a business has special requirements,
          most businesses select an immediate date and time.
        </p>
      </header>

      <EffectiveDateTime
        class="mt-6"
        :class="{ 'invalid-section': isEffectiveDateTimeInvalid }"
        :effectiveDateTime="getEffectiveDateTime"
        label="Continuation Date and Time"
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
          Copies of the continuation documents will be sent to the email addresses listed below.
        </p>
      </header>

      <v-card
        flat
        class="mt-6"
      >
        <DocumentDelivery
          class="py-8 px-6"
          :class="{ 'invalid-section': isDocumentDeliveryInvalid }"
          :editableCompletingParty="isRoleStaff"
          :invalidSection="isDocumentDeliveryInvalid"
          :contactValue="getBusinessContact.email"
          :completingPartyEmail="getUserEmail"
          :documentOptionalEmail="documentOptionalEmail"
          contactLabel="Registered Office"
          @update:optionalEmail="setDocumentOptionalEmail($event)"
          @valid="setDocumentOptionalEmailValidity($event)"
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
          :disableEdit="false"
          :invalidSection="isCertifyInvalid"
          :isStaff="isRoleStaff"
        />
      </v-card>
    </section>

    <!-- Court Order / POA -->
    <section
      v-if="isRoleStaff"
      id="court-order-poa-section"
      class="mt-10"
    >
      <header>
        <h2>Court Order and Plan of Arrangement</h2>
        <p class="mt-4">
          If this filing is pursuant to a court order, enter the court order number. If this filing
          is pursuant to a plan of arrangement, enter the court order number and select Plan of
          Arrangement.
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

    <!-- Document ID Component for Staff only -->
    <section
      v-if="isRoleStaff"
      id="document-id-section"
      class="mt-10"
    >
      <header>
        <h2>Document ID</h2>
        <p class="mt-4">
          Enter or select your document ID preference. Upon submission,
          a document record will be created with the details from this registration.
        </p>
      </header>

      <DocumentId
        :docApiUrl="getDrsApiUrl"
        :docApiKey="getDrsApiKey"
        :validate="getValidateSteps"
        @updateDocId="docId=$event"
        @isValid="isDocIdValid=$event"
      />
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
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { FilingStatus } from '@/enums'
import { CertifyIF, ContactPointIF, CourtOrderStepIF, DocumentDeliveryIF, DocumentIdIF, EffectiveDateTimeIF,
  ExistingBusinessInfoIF, ShareStructureIF } from '@/interfaces'
import CardHeader from '@/components/common/CardHeader.vue'
import Certify from '@/components/common/Certify.vue'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import DocumentId from '@bcrs-shared-components/document-id/DocumentId.vue'
import EffectiveDateTime from '@/components/common/EffectiveDateTime.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import ListShareClass from '@/components/common/ListShareClass.vue'
import SummaryBusinessPreviousJurisdiction from '@/components/ContinuationIn/SummaryBusinessPreviousJurisdiction.vue'
import SummaryExtraprovincialRegistration from '@/components/ContinuationIn/SummaryExtraprovincialRegistration.vue'
import SummaryDefineCompany from '@/components/common/SummaryDefineCompany.vue'
import StaffPayment from '@/components/common/StaffPayment.vue'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { CourtOrderPoa } from '@bcrs-shared-components/court-order-poa'

@Component({
  components: {
    CardHeader,
    Certify,
    CourtOrderPoa,
    DocumentDelivery,
    DocumentId,
    EffectiveDateTime,
    ListPeopleAndRoles,
    ListShareClass,
    SummaryDefineCompany,
    SummaryBusinessPreviousJurisdiction,
    SummaryExtraprovincialRegistration,
    StaffPayment
  }
})
export default class ContinuationInReviewConfirm extends Vue {
  // enum for template
  readonly FilingStatus = FilingStatus

  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getCertifyState!: CertifyIF
  @Getter(useStore) getCourtOrderStep!: CourtOrderStepIF
  @Getter(useStore) getCreateShareStructureStep!: ShareStructureIF
  @Getter(useStore) getDocumentDelivery!: DocumentDeliveryIF
  @Getter(useStore) getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) getFilingStatus!: FilingStatus
  @Getter(useStore) getUserEmail!: string
  @Getter(useStore) getValidateSteps!: boolean
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) getDocumentIdState!: DocumentIdIF

  @Action(useStore) setCertifyState!: (x: CertifyIF) => void
  @Action(useStore) setCourtOrderFileNumber!: (x: string) => void
  @Action(useStore) setCourtOrderValidity!: (x: boolean) => void
  @Action(useStore) setDocumentOptionalEmail!: (x: string) => void
  @Action(useStore) setDocumentOptionalEmailValidity!: (x: boolean) => void
  @Action(useStore) setEffectiveDate!: (x: Date) => void
  @Action(useStore) setEffectiveDateTimeValid!: (x: boolean) => void
  @Action(useStore) setHasPlanOfArrangement!: (x: boolean) => void
  @Action(useStore) setIsFutureEffective!: (x: boolean) => void
  @Action(useStore) setDocumentIdState!: (x: DocumentIdIF) => void

  docId = ''
  isDocIdValid = false

  /**
   * In case submitting the continuation in failed, we want to reset the validity of Certify.
   * This is since the checkbox has to be ticked again after the save dialog has been closed.
   */
  mounted (): void {
    this.setCertifyState({
      certifiedBy: this.getCertifyState.certifiedBy,
      valid: false
    })

    this.docId = this.getDocumentIdState.consumerDocumentId
    this.isDocIdValid = this.getDocumentIdState.valid
  }

  /** Whether the existing business is an extrapro. */
  get isExpro (): boolean {
    return (this.getExistingBusinessInfo.mode === 'EXPRO')
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

  /** Is true when the Court Order conditions are not met. */
  get isCourtOrderInvalid (): boolean {
    return (this.getValidateSteps && !this.getCourtOrderStep.valid)
  }

  /** Is true when the Document Delivery conditions are not met. */
  get isDocumentDeliveryInvalid (): boolean {
    return (this.getValidateSteps && !this.getDocumentDelivery.valid)
  }

  /**
   * Get the Document Delivery email when a staff files.
   * Default: staff email; editable.
   */
  get documentOptionalEmail (): string {
    return this.getDocumentDelivery.documentOptionalEmail || this.getUserEmail
  }

  /** Get Document Record Service API URL */
  get getDrsApiUrl (): string {
    return sessionStorage.getItem('DOC_API_URL')
  }

  get getDrsApiKey (): string {
    return sessionStorage.getItem('DOC_API_KEY')
  }

  @Watch('docId', { immediate: true })
  @Watch('isDocIdValid', { immediate: true })
  // Update Document Id state
  private onDocumentIdStateChange (): void {
    this.setDocumentIdState({
      valid: this.isDocIdValid,
      consumerDocumentId: this.docId
    })
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
</style>
