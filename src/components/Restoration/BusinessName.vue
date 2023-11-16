<template>
  <div id="business-name">
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
      <NameRequestInfo />

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
import { useStore } from '@/store/store'
import { EmptyNameRequest, NameRequestIF } from '@/interfaces/'
import { CommonMixin, DateMixin, NameRequestMixin } from '@/mixins/'
import { NrRequestActionCodes } from '@/enums/'
import { CorpTypeCd, CorrectNameOptions } from '@bcrs-shared-components/enums/'
import { LegalServices } from '@/services/'
import { CorrectName } from '@bcrs-shared-components/correct-name/'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'

@Component({
  components: {
    CorrectName,
    NameRequestInfo
  }
})
export default class BusinessName extends Mixins(CommonMixin, DateMixin, NameRequestMixin) {
  // Global getters
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getBusinessLegalName!: string
  @Getter(useStore) getCorrectNameOption!: CorrectNameOptions
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getNameRequest!: NameRequestIF
  @Getter(useStore) getNameRequestApprovedName!: string
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isRestorationFiling!: boolean

  // Global actions
  @Action(useStore) setBusinessNameValid!: (x: boolean) => void
  @Action(useStore) setCorrectNameOption!: (x: CorrectNameOptions) => void
  @Action(useStore) setNameRequest!: (x: NameRequestIF) => void
  @Action(useStore) setNameRequestApprovedName!: (x: string) => void

  // Local variable
  formType: CorrectNameOptions = null

  /** The company name. */
  get companyName (): string {
    return (this.getNameRequestApprovedName || this.getBusinessLegalName)
  }

  /** This section's validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getShowErrors && !this.getCorrectNameOption)
  }

  /** The current options for name changes. */
  get correctionNameChoices (): Array<CorrectNameOptions> {
    if (this.isRestorationFiling) {
      return [
        CorrectNameOptions.CORRECT_NAME_TO_NUMBER,
        CorrectNameOptions.CORRECT_NEW_NR
      ]
    }

    // fallback case - not used for now
    return [
      CorrectNameOptions.CORRECT_NAME,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER,
      CorrectNameOptions.CORRECT_NEW_NR
    ]
  }

  /** The request action code for this filing type. */
  get requestActionCode (): NrRequestActionCodes {
    if (this.isRestorationFiling) {
      return NrRequestActionCodes.RESTORE
    }

    // fallback case - not used for now
    return null
  }

  /** Whether a new business legal name was entered. */
  get isNewName (): boolean {
    // Approved Name is null when we start
    // and is set when a name option is selected
    return !!this.getNameRequestApprovedName
  }

  /** Reset company name values to original. */
  resetName (): void {
    // clear out existing data
    this.setNameRequest(EmptyNameRequest)
    this.setNameRequestApprovedName(null)
    this.setCorrectNameOption(null)

    // reset flag
    this.formType = null
  }

  /**
   * Fetches and validation a NR.
   * @param nrNum the NR number
   * @param phone the phone number to match
   * @param email the email address to match
   * @returns a promise to return the NR, or throws a printable error
   */
  async fetchAndValidateNr (nrNum: string, phone: string, email: string): Promise<NameRequestIF> {
    const nameRequest = await LegalServices.fetchValidContactNr(nrNum, phone, email)
    if (!nameRequest) throw new Error('Error fetching Name Request')

    // validateNameRequest() already throws printable errors
    return this.validateNameRequest(nameRequest, this.requestActionCode)
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

  /** Updates component validity initially and when correct name option has changed. */
  @Watch('getCorrectNameOption', { immediate: true })
  private updateComponentValidity (): void {
    this.setBusinessNameValid(!!this.getCorrectNameOption)
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
