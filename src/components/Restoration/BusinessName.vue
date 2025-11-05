<template>
  <div id="business-name">
    <NameRequestErrorDialog
      attach="#business-name"
      :dialog="nameRequestErrorDialog"
      :error="nameRequestError"
      @okay="nameRequestErrorDialog = false"
    />

    <!-- Editing Mode -->
    <div
      v-if="!isNewName"
      class="section-container"
      :class="{ 'invalid-section': invalidSection }"
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <label :class="{ 'error-text': invalidSection }">
            <strong>Business Name</strong>
          </label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="pt-4 pt-sm-0"
        >
          <CorrectName
            actionTxt="restore the business"
            :businessId="getBusinessId"
            :companyName="companyName"
            :correctionNameChoices="correctionNameChoices"
            :entityType="getEntityType"
            :fetchAndValidateNr="fetchAndValidateNr"
            :formType="formType"
            :nameRequest="getNameRequest"
            @error="displayError($event)"
            @cancel="resetName()"
            @update:companyName="onUpdateCompanyName($event)"
            @update:formType="formType = $event"
            @update:nameRequest="onUpdateNameRequest($event)"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Display Mode -->
    <template v-else>
      <NameRequestInfo :spaceForButton="true" />

      <v-btn
        text
        color="primary"
        class="btn-undo"
        @click="resetName()"
      >
        <v-icon small>
          mdi-undo
        </v-icon>
        <span>Undo</span>
      </v-btn>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { StatusCodes } from 'http-status-codes'
import { useStore } from '@/store/store'
import { EmptyNameRequest, NameRequestIF } from '@/interfaces/'
import { CommonMixin, DateMixin, NameRequestMixin } from '@/mixins/'
import { CorrectNameOptions, NrRequestActionCodes } from '@bcrs-shared-components/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { LegalServices } from '@/services/'
import { CorrectName } from '@bcrs-shared-components/correct-name/'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'
import { NameRequestErrorDialog } from '@/dialogs/'
import { AuthorizedActions } from '@/enums'
import { IsAuthorized } from '@/utils'

@Component({
  components: {
    CorrectName,
    NameRequestErrorDialog,
    NameRequestInfo
  }
})
export default class BusinessName extends Mixins(CommonMixin, DateMixin, NameRequestMixin) {
  // for template
  readonly AuthorizedActions = AuthorizedActions
  readonly IsAuthorized = IsAuthorized

  // Global getters
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getCorrectNameOption!: CorrectNameOptions
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getNameRequest!: NameRequestIF
  @Getter(useStore) getNameRequestApprovedName!: string
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isRestorationFiling!: boolean

  // Global actions
  @Action(useStore) setCorrectNameOption!: (x: CorrectNameOptions) => void
  @Action(useStore) setNameRequest!: (x: NameRequestIF) => void
  @Action(useStore) setNameRequestApprovedName!: (x: string) => void
  @Action(useStore) setRestorationBusinessNameValid!: (x: boolean) => void

  // Local variable
  formType = null as CorrectNameOptions
  nameRequestErrorDialog = false
  nameRequestError = ''

  /** The company name. */
  get companyName (): string {
    return (this.getNameRequestApprovedName)
  }

  /** This section's validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getShowErrors && !this.getCorrectNameOption)
  }

  /** The current options for name changes. */
  get correctionNameChoices (): Array<CorrectNameOptions> {
    if (this.isRestorationFiling) {
      if (IsAuthorized(AuthorizedActions.ADD_ENTITY_NO_AUTHENTICATION)) {
        return [
          CorrectNameOptions.CORRECT_NAME_TO_NUMBER,
          CorrectNameOptions.CORRECT_NEW_NR_STAFF
        ]
      } else {
        return [
          CorrectNameOptions.CORRECT_NAME_TO_NUMBER,
          CorrectNameOptions.CORRECT_NEW_NR
        ]
      }
    }

    // fallback case - not used for now
    return [
      CorrectNameOptions.CORRECT_NAME,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER,
      CorrectNameOptions.CORRECT_NEW_NR
    ]
  }

  /** Whether a new business legal name was entered. */
  get isNewName (): boolean {
    // Approved Name is null when we start
    // and is set when a name option is selected
    return !!this.getNameRequestApprovedName
  }

  /**
   * Fetches and validates a NR.
   * @param nrNum the NR number
   * @param phone the phone number to match
   * @param email the email address to match
   * @returns a promise to return the NR, else exception
   */
  async fetchAndValidateNr (nrNum: string, phone: string, email: string): Promise<NameRequestIF> {
    // try to fetch the name request
    const nameRequest = await LegalServices.fetchNameRequest(nrNum, phone, email)
      .catch(error => {
        // throw an error that can be displayed to the user
        if (error?.response?.status === StatusCodes.NOT_FOUND) {
          // invalid NR number
          throw new Error('The Name Request could not be found.')
        }
        if (error?.response?.status === StatusCodes.BAD_REQUEST) {
          // incorrect email or phone
          throw new Error('The Name Request is not registered with this Email Address or Phone Number.')
        }
        if (error?.response?.status === StatusCodes.FORBIDDEN) {
          // missing email or phone
          throw new Error('The Name Request is not registered with this Email Address or Phone Number.')
        }
        throw error
      })

    // try to validate the name request
    // (may throw an error that can be displayed to the user)
    return this.validateNameRequest(nameRequest, NrRequestActionCodes.RESTORE, this.getBusinessId, this.getEntityType)
  }

  /** Displays fetch/validation error from CorrectName shared component. */
  displayError (error: string): void {
    this.nameRequestError = error || 'Unknown error. Please try again.'
    this.nameRequestErrorDialog = true
  }

  /** On company name update, sets store accordingly. */
  onUpdateCompanyName (name: string): void {
    this.setCorrectNameOption(this.formType)
    this.setNameRequestApprovedName(name)
  }

  /** On name request update, sets store accordingly. */
  onUpdateNameRequest (nameRequest: NameRequestIF): void {
    this.setNameRequest(nameRequest)
  }

  /** Resets company name values to original when Cancel was clicked. */
  resetName (): void {
    // clear out existing data
    this.setNameRequest(EmptyNameRequest)
    this.setNameRequestApprovedName(null)
    this.setCorrectNameOption(null)

    // reset flag
    this.formType = null
  }

  /** Updates component validity initially and when correct name option has changed. */
  @Watch('getCorrectNameOption', { immediate: true })
  private updateComponentValidity (): void {
    this.setRestorationBusinessNameValid(!!this.getCorrectNameOption)
  }
}
</script>

<style lang="scss" scoped>
// position the Undo button "on top of" NameRequestInfo
.btn-undo {
  position: absolute;
  top: 22px;
  right: 20px;
}

// "sm" breakpoint
@media (min-width: 600px) {
  .btn-undo {
    top: 24px;
  }
}

// "md" breakpoint
@media (min-width: 960px) {
  .btn-undo {
    top: 28px;
  }
}
</style>
