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
          <v-col cols="12" sm="3" class="pr-4">
            <label>
              <strong>Name Request</strong>
            </label>
          </v-col>

          <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
            <ul class="name-request-list-items">
              <li id="name-request-title">
                <strong>{{ getNameRequestNumber }}</strong> - {{ getNameRequestApprovedName }}
              </li>
              <li class="mt-4"><strong>Entity Type:</strong> {{ getEntityTypeDescription }}</li>
              <li><strong>Request Type:</strong> {{ requestType }}</li>
              <li><strong>Expiry Date:</strong> {{ expirationDate }}</li>
              <li><strong>Status:</strong> {{ Capitalize(state) }}</li>
              <li id="condition-consent" v-if="state === NameRequestStates.CONDITIONAL">
                <strong>Condition/Consent:</strong> {{ conditionConsent }}
              </li>
            </ul>
          </v-col>
        </v-row>
      </div>

      <!-- Name Request Applicant -->
      <div class="section-container">
        <v-row no-gutters id="name-request-applicant-info">
          <v-col cols="12" sm="3" class="pr-4">
            <label>
              <strong>Name Request Applicant</strong>
            </label>
          </v-col>

          <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
            <ul class="applicant-list-items">
              <li><strong>Name:</strong> {{ applicantName }}</li>
              <li><strong>Address:</strong> {{ applicantAddress }}</li>
              <li><strong>Email:</strong> {{ emailAddress }}</li>
              <li><strong>Phone:</strong> {{ phoneNumber }}</li>
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
          <v-col cols="12" sm="3" class="pr-4">
            <label>
              <strong>Name Translation</strong>
            </label>
          </v-col>

          <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
            <v-checkbox
              class="pt-0 mt-0"
              v-model="hasNameTranslation"
              id="name-translation-checkbox"
              @click="confirmNameTranslation()"
              hide-details
            >
              <template v-slot:label>
                <span class="translation-checkbox-label">
                  This company uses one or more translations of its name outside of Canada.
                </span>
              </template>
            </v-checkbox>

            <template v-if="hasNameTranslation">
              <p class="mt-4 mb-0">
                <b>Note:</b> Name translations must use the Latin Alphabet (English, French, etc.).
                Names that use other writing systems must spell the name phonetically in English or
                French.
              </p>

              <v-btn
                outlined color="primary"
                class="mt-6"
                @click="isAddingNameTranslation = true"
                :disabled="isAddingNameTranslation"
              >
                <v-icon>mdi-plus</v-icon>
                <span>Add a Name Translation</span>
              </v-btn>

              <!-- Add Name Translation component -->
              <div v-if="isAddingNameTranslation" class="mt-6">
                <AddNameTranslation
                  :edit-name-translation="editingNameTranslation"
                  @addTranslation="addNameTranslation($event)"
                  @cancelTranslation="cancelNameTranslation()"
                  @removeTranslation="removeNameTranslation(editIndex)"
                />
              </div>

              <!-- List Name Translation component -->
              <div v-if="getNameTranslations && getNameTranslations.length > 0" class="mt-6">
                <ListNameTranslations
                  :isAddingNameTranslation="isAddingNameTranslation"
                  :translationsList="getNameTranslations"
                  @editTranslation="editNameTranslation($event)"
                  @removeTranslation="removeNameTranslation($event)"
                />
              </div>
            </template>
          </v-col>
        </v-row>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getName } from 'country-list'
import AddNameTranslation from '@/components/common/AddNameTranslation.vue'
import { ConfirmDialog } from '@bcrs-shared-components/confirm-dialog'
import ListNameTranslations from '@/components/common/ListNameTranslations.vue'
import { CorpTypeCd, NameRequestStates } from '@/enums'
import {
  ActionBindingIF,
  ConfirmDialogType,
  NameRequestApplicantIF,
  NameRequestIF,
  NameTranslationIF,
  RegistrationStateIF
} from '@/interfaces'
import { DateMixin } from '@/mixins'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { Capitalize } from '@/utils'

@Component({
  components: {
    AddNameTranslation,
    ConfirmDialog,
    ListNameTranslations
  },
  mixins: [
    DateMixin
  ]
})
export default class NameRequestInfo extends Vue {
  // Refs
  $refs!: {
    confirmTranslationRemovalDialog: ConfirmDialogType
  }

  // For template
  readonly NameRequestStates = NameRequestStates
  readonly Capitalize = Capitalize

  // Local properties
  protected hasNameTranslation = false
  protected isAddingNameTranslation = true
  protected editingNameTranslation = ''
  protected editIndex = -1

  readonly RECEIVED_STATE = 'Received'
  readonly NOT_RECEIVED_STATE = 'Not Received'
  readonly NOT_REQUIRED_STATE = 'Not Required'
  readonly WAIVED_STATE = 'Waived'

  @Action setNameTranslationState!: ActionBindingIF

  @Getter getEntityType!: CorpTypeCd
  @Getter getNameRequest!: NameRequestIF
  @Getter getNameRequestNumber!: string
  @Getter getNameRequestApprovedName!: string
  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter getRegistration!: RegistrationStateIF
  @Getter isTypeCoop: boolean
  @Getter isTypeSoleProp: boolean
  @Getter isTypePartnership: boolean
  @Getter getShowErrors!: boolean

  /** The entity type description.  */
  get getEntityTypeDescription (): string {
    const corpTypeDescription = GetCorpFullDescription(this.getEntityType)
    if (this.isTypeSoleProp) {
      return `${corpTypeDescription} or Doing Business As (DBA)`
    }
    return corpTypeDescription
  }

  /** The request type. */
  get requestType (): string {
    return 'New Business'
  }

  get showNameTranslation (): boolean {
    if (this.isTypeCoop || this.isTypeSoleProp || this.isTypePartnership) return false
    return true
  }

  /** The expiration date. */
  get expirationDate (): string {
    return this.apiToPacificDateTime(this.getNameRequest.expirationDate, true)
  }

  /** The state. */
  get state (): NameRequestStates {
    if (this.getNameRequest.state === NameRequestStates.APPROVED) {
      return 'Approved'
    }
    return this.getNameRequest.state?.toString() || null
  }

  /** The condition/consent string. */
  get conditionConsent (): string {
    const consentFlag = this.getNameRequest.consentFlag
    if (this.getNameRequest.state === NameRequestStates.APPROVED) {
      return this.NOT_REQUIRED_STATE
    }
    if (consentFlag === null) {
      return this.NOT_REQUIRED_STATE
    }
    if (consentFlag === 'R') {
      return this.RECEIVED_STATE
    }
    if (consentFlag === 'N') {
      return this.WAIVED_STATE
    }
    return this.NOT_RECEIVED_STATE
  }

  /** The applicant. */
  get applicant (): NameRequestApplicantIF {
    return this.getNameRequest.applicants // not an array
  }

  /** The applicant's name. */
  get applicantName (): string {
    let name = this.applicant.firstName
    if (this.applicant.middleName) {
      name = `${name} ${this.applicant.middleName} ${this.applicant.lastName}`
    } else {
      name = `${name} ${this.applicant.lastName}`
    }
    return name
  }

  /** The applicant's address. */
  get applicantAddress (): string {
    const city = this.applicant.city
    const stateProvince = this.applicant.stateProvinceCd
    const postal = this.applicant.postalCd
    const country = this.applicant.countryTypeCd ? getName(this.applicant.countryTypeCd) : ''

    // Build address lines
    let address = this.applicant.addrLine1
    if (this.applicant.addrLine2) {
      address = `${address}, ${this.applicant.addrLine2}`
    }
    if (this.applicant.addrLine3) {
      address = `${address}, ${this.applicant.addrLine3}`
    }

    return `${address}, ${city}, ${stateProvince}, ${postal}, ${country}`
  }

  /** The applicant's email address. */
  get emailAddress (): string {
    return this.applicant.emailAddress
  }

  /** The applicant's phone number. */
  get phoneNumber (): string {
    return this.applicant.phoneNumber
  }

  /**
   * Adds or updates a name translation.
   * @param name The name to add
   */
  protected addNameTranslation (name: string): void {
    const nameTranslations = Object.assign([], this.getNameTranslations)

    // Handle name translation adds or updates
    this.editIndex > -1
      ? nameTranslations[this.editIndex].name = name
      : nameTranslations.push({ name })

    this.setNameTranslationState(nameTranslations)

    // Emit Validation
    this.emitHasNameTranslation()

    this.cancelNameTranslation()
  }

  /**
   * Sets specified name translation to be edited.
   * @param index Index number of the name translation to edit
   */
  protected editNameTranslation (index: number): void {
    const nameTranslations = Object.assign([], this.getNameTranslations)
    this.editingNameTranslation = nameTranslations[index].name
    this.editIndex = index
    this.isAddingNameTranslation = true
  }

  /**
   * Removes a name translation.
   * @param index Index number of the name translation to remove
   */
  protected removeNameTranslation (index: number): void {
    const nameTranslations = Object.assign([], this.getNameTranslations)
    nameTranslations.splice(index, 1)

    this.setNameTranslationState(nameTranslations)

    // Emit Validation
    this.emitHasNameTranslation()

    this.cancelNameTranslation()
  }

  /** Cancels adding or editing of name translation. */
  protected cancelNameTranslation (): void {
    this.isAddingNameTranslation = false
    this.editingNameTranslation = ''
    this.editIndex = -1
  }

  /** Handles name translation checkbox logic. */
  protected confirmNameTranslation (val: boolean) {
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
  get isValidNameTranslation (): boolean {
    return (this.hasNameTranslation ? this.getNameTranslations?.length > 0 : true)
  }

  // Events
  @Emit('hasNameTranslation')
  protected emitHasNameTranslation (): boolean {
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
