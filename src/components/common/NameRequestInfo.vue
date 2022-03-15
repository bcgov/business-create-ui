<template>
  <div id="name-request-summary">
    <ConfirmDialog
      ref="confirmTranslationRemovalDialog"
      attach="#name-request-summary"
    />

    <template v-if="getNameRequestNumber">
      <div class="section-container">
        <!-- Name Request -->
        <v-row no-gutters id="name-request-info">
          <v-col cols="12" sm="3" class="pr-4 pb-4">
            <label>
              <strong>Name Request</strong>
            </label>
          </v-col>

          <v-col cols="12" sm="9">
            <ul class="name-request-list-items">
              <li id="name-request-title">
                <strong>{{ getNameRequestNumber }}</strong> - {{ getNameRequestDetails.approvedName }}
              </li>
              <li class="mt-4"><strong>Entity Type:</strong> {{ getEntityTypeDescription }}</li>
              <li><strong>Request Type:</strong> {{ requestType }}</li>
              <li><strong>Expiry Date:</strong> {{ formattedExpirationDate() }}</li>
              <li><strong>Status:</strong> {{ nameRequestStatus }}</li>
              <li id="condition-consent" v-if="getNameRequestDetails.status === NameRequestStates.CONDITIONAL">
                <strong>Condition/Consent:</strong> {{ conditionConsent }}
              </li>
            </ul>
          </v-col>
        </v-row>
      </div>

      <!-- Name Request Applicant -->
      <div class="section-container">
        <v-row no-gutters id="name-request-applicant-info">
          <v-col cols="12" sm="3" class="pr-4 pb-4">
            <label>
              <strong>Name Request Applicant</strong>
            </label>
          </v-col>

          <v-col cols="12" sm="9">
            <ul class="applicant-list-items">
              <li><strong>Name:</strong> {{ applicantName() }}</li>
              <li><strong>Address:</strong> {{ applicantAddress() }}</li>
              <li><strong>Email:</strong> {{ getNameRequestApplicant.emailAddress }}</li>
              <li><strong>Phone:</strong> {{ getNameRequestApplicant.phoneNumber }}</li>
            </ul>
          </v-col>
        </v-row>
      </div>
    </template>

    <!-- Name -->
    <template v-else>
      <div class="section-container">
        <v-row
          no-gutters
          id="numbered-company-info"
        >
          <v-col cols="12" sm="3" class="pr-4">
            <label>
              <strong>Name</strong>
            </label>
          </v-col>

          <v-col cols="12" sm="9">
            <ul class="numbered-company-list-items">
              <li id="numbered-company-title">
                <strong>[Incorporation Number]</strong> B.C. Ltd.
              </li>
              <li class="mt-4"><strong>Entity Type:</strong> {{ getEntityTypeDescription }}</li>
              <li class="mt-2"><strong>Request Type:</strong> {{ requestType }}</li>
              <li class="bullet-point mt-4 ml-6">You will be filing this Incorporation Application for a company
                created by adding "B.C. Ltd." after the Incorporation Number.
              </li>
              <li class="bullet-point ml-6">Your Incorporation Number will be generated at the end of the filing
                transaction.
              </li>
              <li class="bullet-point ml-6">It is not possible to request a specific Incorporation Number.</li>
            </ul>
          </v-col>
        </v-row>
      </div>
    </template>

    <!-- Name Translation -->
    <template v-if="showNameTranslation">
      <div
        class="section-container"
        :class="{ 'invalid-section': getShowErrors && !isValidNameTranslation }"
      >
        <v-row no-gutters id="name-translation-info">
          <v-col cols="12" sm="3" class="pr-4 pb-4">
            <label>
              <strong>Name Translation</strong>
            </label>
          </v-col>

          <v-col cols="12" sm="9">
            <v-checkbox
              class="pt-0 mt-0"
              v-model="hasNameTranslation"
              id="name-translation-checkbox"
              @click.native="confirmNameTranslation()"
              hide-details
            >
              <span slot="label" class="translation-checkbox-label">
                This company uses one of more translations of its name outside of Canada.
              </span>
            </v-checkbox>

            <template v-if="hasNameTranslation">
              <p class="my-4">
                <b>Note:</b> Name translations must use the Latin Alphabet (English, French, etc.). Names
                that use other writing systems must spell the name phonetically in English or French.
              </p>
              <v-btn
                outlined color="primary"
                @click="isAddingNameTranslation = true"
                :disabled="isAddingNameTranslation"
              >
                <v-icon>mdi-plus</v-icon>
                <span>Add a Name Translation</span>
              </v-btn>
            </template>
          </v-col>
        </v-row>

        <!-- Name Translation Components -->
        <template v-if="hasNameTranslation">
          <v-row no-gutters id="name-translation-container" class="mt-4">
            <v-col cols="12" sm="3" class="pr-4" />

            <v-col cols="12" sm="9">
              <AddNameTranslation
                v-if="isAddingNameTranslation"
                :edit-name-translation="editingNameTranslation"
                @addTranslation="addName($event)"
                @cancelTranslation="cancelNameTranslation()"
                @removeTranslation="removeNameTranslation(editIndex)"
              />
              <ListNameTranslations
                v-if="getNameTranslations && getNameTranslations.length > 0"
                :isAddingNameTranslation="isAddingNameTranslation"
                :translationsList="getNameTranslations"
                @editNameTranslation="editNameTranslation($event)"
                @removeNameTranslation="removeNameTranslation($event)"
              />
            </v-col>
          </v-row>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getName } from 'country-list'
import AddNameTranslation from '@/components/common/AddNameTranslation.vue'
import ConfirmDialog from '@/dialogs/ConfirmDialog.vue'
import ListNameTranslations from '@/components/common/ListNameTranslations.vue'
import { CorpTypeCd, NameRequestStates } from '@/enums'
import {
  NameRequestDetailsIF,
  NameRequestApplicantIF,
  ConfirmDialogType,
  ActionBindingIF,
  NameTranslationIF
} from '@/interfaces'
import { DateMixin, EnumMixin } from '@/mixins'

@Component({
  components: {
    AddNameTranslation,
    ConfirmDialog,
    ListNameTranslations
  }
})
export default class NameRequestInfo extends Mixins(DateMixin, EnumMixin) {
  // Refs
  $refs!: {
    confirmTranslationRemovalDialog: ConfirmDialogType
  }

  // Enum for template
  readonly NameRequestStates = NameRequestStates

  // Local properties
  private hasNameTranslation = false
  private isAddingNameTranslation = true
  private editingNameTranslation = ''
  private editIndex = -1

  readonly RECEIVED_STATE = 'Received'
  readonly NOT_RECEIVED_STATE = 'Not Received'
  readonly NOT_REQUIRED_STATE = 'Not Required'
  readonly WAIVED_STATE = 'Waived'

  @Action setNameTranslationState!: ActionBindingIF

  @Getter getEntityType!: CorpTypeCd
  @Getter getNameRequestNumber!: string
  @Getter getNameRequestDetails!: NameRequestDetailsIF
  @Getter getNameRequestApplicant!: NameRequestApplicantIF
  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter isTypeCoop: boolean
  @Getter isTypeSoleProp: boolean
  @Getter isTypePartnership: boolean
  @Getter getShowErrors!: boolean

  /** The entity title.  */
  private get getEntityTypeDescription (): string {
    return `${this.getCorpTypeDescription(this.getEntityType)}`
  }

  /** The request type. */
  private get requestType (): string {
    return 'New Business'
  }

  private get showNameTranslation (): boolean {
    if (this.isTypeCoop || this.isTypeSoleProp || this.isTypePartnership) return false
    return true
  }

  /** Returns formatted expiration date. */
  private formattedExpirationDate (): string {
    const date = this.apiToDate(this.getNameRequestDetails.expirationDate)
    return this.dateToPacificDate(date)
  }

  /** The name request status string. */
  private get nameRequestStatus (): string {
    if (this.getNameRequestDetails.status === NameRequestStates.APPROVED) {
      return 'Approved'
    }
    return this.getNameRequestDetails.status?.toString() || null
  }

  /** The condition/consent string. */
  private get conditionConsent (): string {
    if (this.getNameRequestDetails.status === NameRequestStates.APPROVED) {
      return this.NOT_REQUIRED_STATE
    }
    if (this.getNameRequestDetails.consentFlag === null) {
      return this.NOT_REQUIRED_STATE
    }
    if (this.getNameRequestDetails.consentFlag === 'R') {
      return this.RECEIVED_STATE
    }
    if (this.getNameRequestDetails.consentFlag === 'N') {
      return this.WAIVED_STATE
    }
    return this.NOT_RECEIVED_STATE
  }

  /** Returns formatted applicant name. */
  private applicantName (): string {
    let name = this.getNameRequestApplicant.firstName
    if (this.getNameRequestApplicant.middleName) {
      name = `${name} ${this.getNameRequestApplicant.middleName} ${this.getNameRequestApplicant.lastName}`
    } else {
      name = `${name} ${this.getNameRequestApplicant.lastName}`
    }
    return name
  }

  /** Returns formatted address string. */
  private applicantAddress (): string {
    // Get Address info
    const city = this.getNameRequestApplicant.city
    const stateProvince = this.getNameRequestApplicant.stateProvinceCode
    const postal = this.getNameRequestApplicant.postalCode
    const country = this.getNameRequestApplicant.countryTypeCode
      ? getName(this.getNameRequestApplicant.countryTypeCode) : ''

    // Build address lines
    let address = this.getNameRequestApplicant.addressLine1
    if (this.getNameRequestApplicant.addressLine2) {
      address = `${address}, ${this.getNameRequestApplicant.addressLine2}`
    }
    if (this.getNameRequestApplicant.addressLine3) {
      address = `${address}, ${this.getNameRequestApplicant.addressLine3}`
    }

    return `${address}, ${city}, ${stateProvince}, ${postal}, ${country}`
  }

  /**
   * Adds or updates a name translation.
   * @param name The name to add
   */
  private addName (name: string): void {
    const nameTranslations = Object.assign([], this.getNameTranslations)

    // Handle name translation adds or updates
    this.editIndex > -1
      ? nameTranslations[this.editIndex].name = name
      : nameTranslations.push({ name: name })

    this.setNameTranslationState(nameTranslations)

    // Emit Validation
    this.emitHasNameTranslation()

    this.cancelNameTranslation()
  }

  /**
   * Sets specified name translation to be edited.
   * @param index Index number of the name translation to edit
   */
  private editNameTranslation (index: number): void {
    const nameTranslations = Object.assign([], this.getNameTranslations)
    this.editingNameTranslation = nameTranslations[index].name
    this.editIndex = index
    this.isAddingNameTranslation = true
  }

  /**
   * Removes a name translation.
   * @param index Index number of the name translation to remove
   */
  private removeNameTranslation (index: number): void {
    const nameTranslations = Object.assign([], this.getNameTranslations)
    nameTranslations.splice(index, 1)

    this.setNameTranslationState(nameTranslations)

    // Emit Validation
    this.emitHasNameTranslation()

    this.cancelNameTranslation()
  }

  /** Cancels adding or editing of name translation. */
  private cancelNameTranslation (): void {
    this.isAddingNameTranslation = false
    this.editingNameTranslation = ''
    this.editIndex = -1
  }

  /** Handles name translation checkbox logic. */
  private confirmNameTranslation (val: boolean) {
    // if user is unchecking the box and there are name translations
    // then prompt whether to delete them all
    if (!this.hasNameTranslation && this.getNameTranslations?.length > 0) {
      // open confirmation dialog and wait for response
      this.$refs.confirmTranslationRemovalDialog.open(
        'Remove All Name Translations',
        'De-selecting the Name Translation option will remove all name translations.',
        {
          width: '45rem',
          persistent: true,
          yes: 'Remove All Translations',
          no: null,
          cancel: 'Cancel'
        }
      ).then(async (confirm) => {
        if (confirm) {
          this.setNameTranslationState([])
          // clear the checkbox
          this.hasNameTranslation = false
        }
      }).catch(() => {
        // reset the checkbox
        this.hasNameTranslation = true
      })
    }

    // Emit Validation
    this.emitHasNameTranslation()
  }

  /** Whether name translation is valid. */
  private get isValidNameTranslation (): boolean {
    return this.hasNameTranslation ? this.getNameTranslations?.length > 0 : true
  }

  // Events
  @Emit('hasNameTranslation')
  private emitHasNameTranslation (): boolean {
    return this.isValidNameTranslation
  }

  @Watch('getNameTranslations', { deep: true, immediate: true })
  private updateNameTranslation (): void {
    if (this.getNameTranslations?.length > 0) {
      this.isAddingNameTranslation = false
      this.hasNameTranslation = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

p {
  font-size: $px-14;
}

ul {
  font-size: $px-15;
  margin: 0;
  padding: 0;
  list-style-type: none;
}

#name-request-title,
#numbered-company-title {
  font-size: $px-20;
}

.numbered-company-list-items {
  .bullet-point::before {
    content: "\2022";
    display: inline-block;
    width: 1.5em;
    margin-left: -1.5em;
  }
}

#name-translation-info {
  .translation-checkbox-label {
    font-size: $px-14;
    color: $gray9;
  }
}

.name-request-list-items,
.applicant-list-items {
  li:not(:first-child) {
    margin-top: 8px;
  }
}
</style>
