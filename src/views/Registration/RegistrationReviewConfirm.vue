<template>
  <div id="registration-review-confirm">
    <!-- Review and Confirm -->
    <section
      id="review-and-confirm-section"
      class="mt-10"
    >
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-4">
          Review the information in your registration. If you need to change or complete anything,
          return to the step to make the necessary change.
        </p>
      </header>

      <!-- Your Business -->
      <v-card
        id="your-business-vcard"
        flat
        class="mt-6"
      >
        <CardHeader
          icon="mdi-domain"
          label="Your Business"
        />
        <DefineRegistrationSummary />
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
    </section>

    <!-- Document Delivery -->
    <section
      id="document-delivery-section"
      class="mt-10"
    >
      <header>
        <h2>Document Delivery</h2>
        <p class="mt-4">
          Copies of the registration documents will be sent to the email addresses listed below.
        </p>
      </header>

      <v-card
        flat
        class="mt-6"
      >
        <DocumentDelivery
          class="py-8 px-6"
          :class="{ 'invalid-section': isDocumentDeliveryInvalid }"
          :contactLabel="'Business Office'"
          :contactValue="getBusinessContact.email"
          :editableCompletingParty="IsAuthorized(AuthorizedActions.EDITABLE_COMPLETING_PARTY)"
          :completingPartyEmail="getUserEmail"
          :documentOptionalEmail="documentOptionalEmail"
          :additionalLabel="documentDeliveryAdditionalLabel"
          :additionalValue="documentDeliveryAdditionalValue"
          :invalidSection="isDocumentDeliveryInvalid"
          @valid="setDocumentOptionalEmailValidity($event)"
        />
      </v-card>
    </section>

    <!-- Transactional Folio Number (mutually exclusive with Staff Payment) -->
    <section
      v-if="!IsAuthorized(AuthorizedActions.STAFF_PAYMENT)"
      id="folio-section"
      class="mt-10"
    >
      <TransactionalFolioNumber
        class="py-8 px-6"
        :transactionalFolioNumber="getTransactionalFolioNumber"
        :doValidate="getValidateSteps"
        @change="setTransactionalFolioNumber($event)"
        @valid="setTransactionalFolioNumberValidity($event)"
      />
    </section>

    <!-- Certify -->
    <section
      id="certify-section"
      class="mt-10"
    >
      <header>
        <h2>Certify</h2>
        <p class="mt-4">
          Confirm the legal name of the person authorized to complete and submit this registration.
        </p>
      </header>

      <v-card
        flat
        class="mt-6"
      >
        <Certify
          class="py-8 px-6"
          :class="{ 'invalid-section': isCertifyInvalid }"
          :disableEdit="!IsAuthorized(AuthorizedActions.EDITABLE_CERTIFY_NAME)"
          :invalidSection="isCertifyInvalid"
          :isStaff="IsAuthorized(AuthorizedActions.THIRD_PARTY_CERTIFY_STMT)"
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
    <template v-if="IsAuthorized(AuthorizedActions.STAFF_PAYMENT)">
      <!-- Staff Payment -->
      <section
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
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ContactPointIF, CertifyIF, DocumentDeliveryIF, DocumentIdIF, PeopleAndRoleIF } from '@/interfaces'
import { AuthorizedActions, RoleTypes } from '@/enums'
import CardHeader from '@/components/common/CardHeader.vue'
import Certify from '@/components/common/Certify.vue'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import DocumentId from '@bcrs-shared-components/document-id/DocumentId.vue'
import StaffPayment from '@/components/common/StaffPayment.vue'
import DefineRegistrationSummary from '@/components/Registration/DefineRegistrationSummary.vue'
import FeeAcknowledgement from '@/components/Registration/FeeAcknowledgement.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import TransactionalFolioNumber from '@/components/common/TransactionalFolioNumber.vue'
import { IsAuthorized } from '@/utils'

@Component({
  components: {
    CardHeader,
    Certify,
    DefineRegistrationSummary,
    DocumentDelivery,
    DocumentId,
    FeeAcknowledgement,
    ListPeopleAndRoles,
    StaffPayment,
    TransactionalFolioNumber
  }
})
export default class RegistrationReviewConfirm extends Vue {
  // for template
  readonly AuthorizedActions = AuthorizedActions
  readonly IsAuthorized = IsAuthorized

  @Getter(useStore) getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getCertifyState!: CertifyIF
  @Getter(useStore) getDocumentDelivery!: DocumentDeliveryIF
  @Getter(useStore) getDocumentIdState!: DocumentIdIF
  @Getter(useStore) getFolioNumber!: string
  @Getter(useStore) getTransactionalFolioNumber!: string
  @Getter(useStore) getUserEmail!: string
  @Getter(useStore) getValidateSteps!: boolean
  @Getter(useStore) isEntityPartnership!: boolean
  @Getter(useStore) isEntitySoleProp!: boolean

  @Action(useStore) setDocumentOptionalEmailValidity!: (x: boolean) => void
  @Action(useStore) setTransactionalFolioNumber!: (x: string) => void
  @Action(useStore) setTransactionalFolioNumberValidity!: (x: boolean) => void
  @Action(useStore) setDocumentIdState!: (x: DocumentIdIF) => void

  docId = ''
  isDocIdValid = false

  mounted (): void {
    this.docId = this.getDocumentIdState.consumerDocumentId
    this.isDocIdValid = this.getDocumentIdState.valid
  }
  /** The Document Delivery additional email label. */
  get documentDeliveryAdditionalLabel (): string {
    if (this.isEntitySoleProp) return 'Proprietor'
    if (this.isEntityPartnership) return 'Partners'
    return null
  }

  /** The Document Delivery additional email value. */
  get documentDeliveryAdditionalValue (): string {
    const orgPersonList = this.getAddPeopleAndRoleStep.orgPeople

    if (this.isEntitySoleProp) {
      const emails = orgPersonList
        .filter(op => op.roles.some(role => role.roleType === RoleTypes.PROPRIETOR))
        .map(op => op.officer?.email)
        .filter(e => !!e)
      return emails.join(', ')
    }
    if (this.isEntityPartnership) {
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

#registration-review-confirm {
  counter-reset: header-counter;
}
#registration-review-confirm ::v-deep(section) h2::before {
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}
</style>
