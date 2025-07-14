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

      <!-- Business Name -->
      <v-card
        id="business-name-vcard"
        flat
        class="mt-6"
      >
        <CardHeader
          icon="mdi-domain-plus"
          label="Business Name"
        />
        <SummaryRestoreBusiness />
      </v-card>

      <!-- Applicant Information -->
      <v-card
        id="applicant-information-vcard"
        flat
        class="mt-6"
      >
        <CardHeader
          icon="mdi-account-multiple-plus"
          label="Applicant Information"
        />
        <ListPeopleAndRoles
          :isSummary="true"
          :showDeliveryAddressColumn="!isFullRestorationFiling && !isLimitedRestorationFiling"
          :showRolesColumn="!isFullRestorationFiling && !isLimitedRestorationFiling"
          :showEmailColumn="isFullRestorationFiling || isLimitedRestorationFiling"
        />
      </v-card>

      <!-- Business Information -->
      <v-card
        id="business-information-vcard"
        flat
        class="mt-6"
      >
        <CardHeader
          icon="mdi-domain"
          label="Business Information"
        />
        <SummaryDefineCompany />
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
          Copies of the restoration documents will be sent to the email addresses listed below.
        </p>
      </header>

      <v-card
        flat
        class="mt-6"
      >
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
import { CertifyIF, ContactPointIF, DocumentIdIF, PeopleAndRoleIF } from '@/interfaces'
import { AuthorizedActions, RoleTypes } from '@/enums'
import CardHeader from '@/components/common/CardHeader.vue'
import Certify from '@/components/common/Certify.vue'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import DocumentId from '@bcrs-shared-components/document-id/DocumentId.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import StaffPayment from '@/components/common/StaffPayment.vue'
import SummaryDefineCompany from '@/components/common/SummaryDefineCompany.vue'
import SummaryRestoreBusiness from '@/components/Restoration/SummaryRestoreBusiness.vue'
import { IsAuthorized } from '@/utils'

@Component({
  components: {
    CardHeader,
    Certify,
    DocumentDelivery,
    DocumentId,
    ListPeopleAndRoles,
    StaffPayment,
    SummaryDefineCompany,
    SummaryRestoreBusiness
  }
})
export default class RestorationReviewConfirm extends Vue {
  // for template
  readonly AuthorizedActions = AuthorizedActions
  readonly IsAuthorized = IsAuthorized

  @Getter(useStore) getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getCertifyState!: CertifyIF
  @Getter(useStore) getDocumentIdState!: DocumentIdIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getUserEmail!: string
  @Getter(useStore) getValidateSteps!: boolean
  @Getter(useStore) isFullRestorationFiling!: boolean
  @Getter(useStore) isLimitedRestorationFiling!: boolean

  @Action(useStore) setCertifyState!: (x: CertifyIF) => void
  @Action(useStore) setDocumentIdState!: (x: DocumentIdIF) => void

  docId = ''
  isDocIdValid = false

  mounted (): void {
    this.docId = this.getDocumentIdState.consumerDocumentId
    this.isDocIdValid = this.getDocumentIdState.valid
  }

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
