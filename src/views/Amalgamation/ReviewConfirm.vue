<template>
  <div id="amalgamation-review-confirm">
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
          label="Amalgamation Information"
        />
        <SummaryDefineCompany />
      </v-card>

      <!-- Amalgamating Businesses Information -->
      <v-card
        id="amalgamating-businesses-information-vcard"
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
          :showErrorSummary="showErrorSummary"
          :isAmalgamationFiling="true"
        />
        <ListResolutions />
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

      <EffectiveDateTime
        class="mt-6"
        :class="{ 'invalid-section': isEffectiveDateTimeInvalid }"
        :effectiveDateTime="getEffectiveDateTime"
        label="Amalgamation Date and Time"
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
          Copies of the amalgamation documents will be sent to the email addresses listed below.
        </p>
      </header>

      <v-card
        flat
        class="mt-6"
      >
        <DocumentDelivery
          class="py-8 px-6"
          :class="{ 'invalid-section': isDocumentDeliveryInvalid }"
          :editableCompletingParty="IsAuthorized(AuthorizedActions.EDITABLE_COMPLETING_PARTY)"
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

    <!-- Folio or Reference Number (mutually exclusive with Staff Payment) -->
    <section
      v-if="!IsAuthorized(AuthorizedActions.STAFF_PAYMENT)"
      id="folio-number-section"
      class="mt-10"
    >
      <header>
        <h2>Folio or Reference Number for this Filing</h2>
        <p class="mt-4">
          Enter the folio or reference number you want to use for this filing for your own tracking purposes. The
          Business Folio or Reference Number is displayed below (if available). Entering a different value below will
          not change the Business Folio or Reference Number. Only the number below will appear on the transaction report
          and receipt for this filing.
        </p>
      </header>

      <v-card
        flat
        class="mt-6"
      >
        <div
          class="px-4 py-8"
          :class="{ 'invalid-section': isFolioInvalid}"
        >
          <FolioNumber
            :initialValue="getFolioNumber"
            :isEditing="true"
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
          Please indicate the statement applicable to this amalgamation.
        </p>
      </header>

      <AmalgamationStatement
        :class="{ 'invalid-section': isAmalgamationStatementInvalid }"
        :invalidSection="isAmalgamationStatementInvalid"
        @update="setAmalgamationCourtApproval($event)"
        @valid="setAmalgamationCourtApprovalValid($event)"
      />
    </section>

    <!-- Court Order and Plan of Arrangement -->
    <section
      v-if="IsAuthorized(AuthorizedActions.COURT_ORDER_POA)"
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
          :isStaff="IsAuthorized(AuthorizedActions.THIRD_PARTY_CERTIFY_STMT)"
        />
      </v-card>
    </section>

    <!-- Document ID Component for Staff only -->
    <section
      v-if="IsAuthorized(AuthorizedActions.DOCUMENT_RECORDS)"
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
      v-if="IsAuthorized(AuthorizedActions.STAFF_PAYMENT)"
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
import { AuthorizedActions } from '@/enums'
import { ContactPointIF, CertifyIF, DocumentIdIF, EffectiveDateTimeIF, ShareStructureIF,
  CourtOrderStepIF, DocumentDeliveryIF } from '@/interfaces'
import CardHeader from '@/components/common/CardHeader.vue'
import Certify from '@/components/common/Certify.vue'
import { CourtOrderPoa } from '@bcrs-shared-components/court-order-poa'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import DocumentId from '@bcrs-shared-components/document-id/DocumentId.vue'
import FolioNumber from '@/components/common/FolioNumber.vue'
import BusinessTableSummary from '@/components/Amalgamation/BusinessTableSummary.vue'
import AmalgamationStatement from '@/components/Amalgamation/AmalgamationStatement.vue'
import EffectiveDateTime from '@/components/common/EffectiveDateTime.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import ListShareClass from '@/components/common/ListShareClass.vue'
import SummaryDefineCompany from '@/components/common/SummaryDefineCompany.vue'
import StaffPayment from '@/components/common/StaffPayment.vue'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import ListResolutions from '@/components/common/ListResolutions.vue'
import { IsAuthorized } from '@/utils'

@Component({
  components: {
    AmalgamationStatement,
    BusinessTableSummary,
    CardHeader,
    Certify,
    CourtOrderPoa,
    DocumentDelivery,
    DocumentId,
    FolioNumber,
    EffectiveDateTime,
    ListPeopleAndRoles,
    ListShareClass,
    ListResolutions,
    SummaryDefineCompany,
    StaffPayment
  }
})
export default class AmalgamationReviewConfirm extends Vue {
  // for template
  readonly AuthorizedActions = AuthorizedActions
  readonly IsAuthorized = IsAuthorized

  @Getter(useStore) getAmalgamatingBusinessesValid!: boolean
  @Getter(useStore) getAmalgamationCourtApprovalValid!: boolean
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getCertifyState!: CertifyIF
  @Getter(useStore) getCourtOrderStep!: CourtOrderStepIF
  @Getter(useStore) getCreateShareStructureStep!: ShareStructureIF
  @Getter(useStore) getDocumentIdState!: DocumentIdIF
  @Getter(useStore) getDocumentDelivery!: DocumentDeliveryIF
  @Getter(useStore) getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getFolioNumber!: string
  @Getter(useStore) getFolioNumberValid!: boolean
  @Getter(useStore) getUserEmail!: string
  @Getter(useStore) getValidateSteps!: boolean
  @Getter(useStore) isAmalgamationFilingRegular!: boolean

  @Action(useStore) setAmalgamationCourtApproval!: (x: boolean) => void
  @Action(useStore) setAmalgamationCourtApprovalValid!: (x: boolean) => void
  @Action(useStore) setCertifyState!: (x: CertifyIF) => void
  @Action(useStore) setCourtOrderFileNumber!: (x: string) => void
  @Action(useStore) setCourtOrderValidity!: (x: boolean) => void
  @Action(useStore) setDocumentOptionalEmail!: (x: string) => void
  @Action(useStore) setDocumentOptionalEmailValidity!: (x: boolean) => void
  @Action(useStore) setEffectiveDate!: (x: Date) => void
  @Action(useStore) setEffectiveDateTimeValid!: (x: boolean) => void
  @Action(useStore) setFolioNumber!: (x: string) => void
  @Action(useStore) setFolioNumberValidity!: (x: boolean) => void
  @Action(useStore) setHasPlanOfArrangement!: (x: boolean) => void
  @Action(useStore) setIsFutureEffective!: (x: boolean) => void
  @Action(useStore) setDocumentIdState!: (x: DocumentIdIF) => void

  docId = ''
  isDocIdValid = false

  /**
   * In case submitting the amalgamation failed, we want to reset the validity of Certify.
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

  /** Whether to show the List Share Class error summary -- only for regular amalgamations. */
  get showErrorSummary (): boolean {
    if (this.isAmalgamationFilingRegular) return (!this.getCreateShareStructureStep.valid)
    return false
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

  /** Is true when the Folio Number is not valid */
  get isFolioInvalid (): boolean {
    return (this.getValidateSteps && !this.getFolioNumberValid)
  }

  /** Is true when the amalgamation statement is not valid */
  get isAmalgamationStatementInvalid (): boolean {
    return (this.getValidateSteps && !this.getAmalgamationCourtApprovalValid)
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
    return import.meta.env.VUE_APP_DOC_API_KEY
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

#amalgamation-review-confirm {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}
</style>
