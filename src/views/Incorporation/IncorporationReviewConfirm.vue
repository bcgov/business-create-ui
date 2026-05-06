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
      <template v-if="isEntityCoop">
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
      <template v-if="isEntityCoop">
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

        <EffectiveDateTime
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

    <!-- Completing Party Statement -->
    <ConfirmCompletion
      v-if="isBaseCompany && showCompPartyChanges"
      class="mt-10"
      :invalid-section="isCompPartyInvalid"
    >
      <template #header>
        <h2>Completing Party Statement</h2>
      </template>
      <template
        v-if="IsAuthorized(AuthorizedActions.THIRD_PARTY_CERTIFY_STMT)"
        #above-checkbox
      >
        <v-form
          ref="completingPartyForm"
          class="flex"
          lazy-validation
          @submit.prevent
        >
          <v-text-field
            id="completing-party-textfield"
            v-model="getConfirmCompletionState.completedBy"
            filled
            persistent-hint
            label="Legal name of completing party"
            :rules="[(v) => !!v || 'Please enter the full legal name of the completing party']"
          />
        </v-form>
      </template>
      I, <b>{{ completingParty || '[Legal name of completing party]' }}</b>,
      the completing party, have examined the incorporation agreement and
      articles applicable to the company being incorporated and confirm the following:
      <br><br>
      (a) a signature line exists for each incorporator,
      <br><br>
      (b) each signature line contains an original signature, and
      <br><br>
      (c) I have no reason to believe any signature is not that of the identified incorporator.
    </ConfirmCompletion>

    <!-- Certify -->
    <section
      v-if="showCompPartyChanges"
      id="certify-section"
      class="mt-10"
    >
      <header>
        <h2>Certify</h2>
        <p class="mt-4">
          {{ certifyText }}
        </p>
      </header>

      <v-card
        flat
        class="mt-6"
      >
        <Certify
          class="py-8 px-6"
          :class="{ 'invalid-section': isCertifyInvalid, 'prevent-red-title': isBaseCompany }"
          :disableEdit="isEntityCoop && !IsAuthorized(AuthorizedActions.EDITABLE_CERTIFY_NAME)"
          :entityDisplay="getEntityDescription"
          :invalidSection="isCertifyInvalid"
          :isStaff="IsAuthorized(AuthorizedActions.THIRD_PARTY_CERTIFY_STMT)"
          :showLegalName="!isBaseCompany"
        >
          <template
            v-if="!isEntityCoop && IsAuthorized(AuthorizedActions.THIRD_PARTY_CERTIFY_STMT)"
            #checkbox-label
          >
            <p
              class="ma-0 certify-stmt"
            >
              {{ getConfirmCompletionState.completedBy || '[Completing Party]' }}
              certifies that the information provided is correct and that
              they are authorized to submit this filing on behalf of the
              {{ getEntityDescription }}.
            </p>
          </template>
        </Certify>
      </v-card>
    </section>
    <!-- NOTE: below will be removed shortly -->
    <section
      v-else
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
          :disableEdit="isEntityCoop && !IsAuthorized(AuthorizedActions.EDITABLE_CERTIFY_NAME)"
          :invalidSection="isCertifyInvalid"
          :isStaff="IsAuthorized(AuthorizedActions.THIRD_PARTY_CERTIFY_STMT)"
        >
          <template
            v-if="!isEntityCoop"
            #checkbox-label
          >
            <p class="ma-0">
              I, <strong>{{ getCertifyState.certifiedBy || "[Legal Name]" }}</strong>, certify that I have relevant
              knowledge of the {{ getCompletingPartyStatement.entityDisplay || 'business' }}
              and I am authorized to make this filing.
              <ul class="ml-n2 pt-2">
                <li
                  v-if="getEntityType === 'BEN'"
                  class="pt-2"
                >
                  The Company Articles and the Incorporation Agreement both contain a signature
                  line for each person identified as an incorporator in the Incorporation Application
                  with the name of that person set out legibly under the signature line,
                </li>
                <li class="pt-2">
                  An original signature has been placed on each of those signature lines.
                </li>
                <li class="pt-2">
                  I have no reason to believe that the signature placed on a
                  signature line is not the signature of the person whose name is set out
                  under that signature line.
                </li>
                <li class="pt-2">
                  I have relevant knowledge of the company and that I am authorized to make this filing.
                </li>
              </ul>
            </p>
          </template>
        </Certify>
      </v-card>
    </section>

    <!-- Court Order and Plan of Arrangement -->
    <section
      v-if="isBaseCompany && IsAuthorized(AuthorizedActions.COURT_ORDER_POA)"
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
import { Component, Watch, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { CompletingPartyStatementIF, FormIF } from '@bcrs-shared-components/interfaces'
import { ContactPointIF, CertifyIF, EffectiveDateTimeIF, IncorporationAgreementIF,
  ShareStructureIF, CourtOrderStepIF, DocumentDeliveryIF, ConfirmCompletionIF
} from '@/interfaces'
import { AuthorizedActions } from '@/enums'
import AgreementType from '@/components/common/AgreementType.vue'
import ConfirmCompletion from '@/components/common/ConfirmCompletion.vue'
import CardHeader from '@/components/common/CardHeader.vue'
import Certify from '@/components/common/Certify.vue'
import { CourtOrderPoa } from '@bcrs-shared-components/court-order-poa'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import EffectiveDateTime from '@/components/common/EffectiveDateTime.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import ListShareClass from '@/components/common/ListShareClass.vue'
import SummaryDefineCompany from '@/components/common/SummaryDefineCompany.vue'
import UploadMemorandumSummary from '@/components/Incorporation/UploadMemorandumSummary.vue'
import UploadRulesSummary from '@/components/Incorporation/UploadRulesSummary.vue'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import StaffPayment from '@/components/common/StaffPayment.vue'
import { GetFeatureFlag, IsAuthorized } from '@/utils'

@Component({
  components: {
    AgreementType,
    CardHeader,
    Certify,
    ConfirmCompletion,
    CourtOrderPoa,
    DocumentDelivery,
    EffectiveDateTime,
    ListPeopleAndRoles,
    ListShareClass,
    SummaryDefineCompany,
    UploadMemorandumSummary,
    UploadRulesSummary,
    StaffPayment
  }
})
export default class IncorporationReviewConfirm extends Vue {
  // for template
  readonly AuthorizedActions = AuthorizedActions
  readonly IsAuthorized = IsAuthorized

  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getCertifyState!: CertifyIF
  @Getter(useStore) getConfirmCompletionState!: ConfirmCompletionIF
  @Getter(useStore) getCompanyDisplayName!: string
  @Getter(useStore) getCompletingPartyStatement!: CompletingPartyStatementIF
  @Getter(useStore) getCourtOrderStep!: CourtOrderStepIF
  @Getter(useStore) getCreateShareStructureStep!: ShareStructureIF
  @Getter(useStore) getDocumentDelivery!: DocumentDeliveryIF
  @Getter(useStore) getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getIncorporationAgreementStep!: IncorporationAgreementIF
  @Getter(useStore) getUserEmail!: string
  @Getter(useStore) getUserFirstname!: string
  @Getter(useStore) getUserLastname!: string
  @Getter(useStore) getValidateSteps!: boolean
  @Getter(useStore) isBaseCompany!: boolean
  @Getter(useStore) isEntityCoop!: boolean

  @Action(useStore) setCertifyState!: (x: CertifyIF) => void
  @Action(useStore) setConfirmCompletionState!: (x: ConfirmCompletionIF) => void
  @Action(useStore) setCourtOrderFileNumber!: (x: string) => void
  @Action(useStore) setCourtOrderValidity!: (x: boolean) => void
  @Action(useStore) setDocumentOptionalEmail!: (x: string) => void
  @Action(useStore) setDocumentOptionalEmailValidity!: (x: boolean) => void
  @Action(useStore) setEffectiveDate!: (x: Date) => void
  @Action(useStore) setEffectiveDateTimeValid!: (x: boolean) => void
  @Action(useStore) setHasPlanOfArrangement!: (x: boolean) => void
  @Action(useStore) setIsFutureEffective!: (x: boolean) => void

  @Watch('isCompPartyInvalid', { immediate: false })
  private validateFields (): void {
    this.$refs.completingPartyForm?.validate()
  }

  $refs: { completingPartyForm: FormIF }

  /**
   * In case submitting the incorporation failed, we want to reset the validity of Certify.
   * This is since the checkbox has to be ticked again after the save dialog has been closed.
   */
  mounted (): void {
    this.setConfirmCompletionState({
      completedBy: this.completingParty,
      confirmed: false
    })
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
    return this.getValidateSteps && (
      this.isBaseCompany
        ? !this.getCertifyState.valid
        : !this.getCertifyState.valid || !this.getCertifyState.certifiedBy)
  }

  get isCompPartyInvalid (): boolean {
    return this.getValidateSteps && !(this.getConfirmCompletionState.confirmed && this.completingParty)
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

  get userFullName (): string {
    return `${this.getUserFirstname?.trim()} ${this.getUserLastname?.trim()}`.trim() || undefined
  }

  get certifyText (): string {
    return this.isBaseCompany
      ? 'Certify your authorization to complete and submit this filing. ' +
        'The name of the person submitting this filing will be displayed in ' +
        `the history of filings for this ${this.getEntityDescription}.`
      : 'Confirm the legal name of the person authorized to complete and submit this application.'
  }

  get completingParty (): string {
    return IsAuthorized(AuthorizedActions.THIRD_PARTY_CERTIFY_STMT)
      ? this.getConfirmCompletionState.completedBy
      : this.userFullName
  }

  get showCompPartyChanges (): boolean {
    const enabledNewFeatures: string = GetFeatureFlag('enable-new-feature')
    return enabledNewFeatures.includes('incorporationApplication-completingParty')
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
