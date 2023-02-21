<template>
  <div id="business-name">
    <!-- *** TODO: remove before flight -->
    <pre>companyName={{ companyName }}</pre>
    <pre>getNameRequestApprovedName={{ getNameRequestApprovedName }}</pre>
    <pre>isCorrectingName={{ isCorrectingName }}</pre>
    <!-- Display Mode -->
    <template v-if="isNewName">
      <NameRequestInfo />

      <v-btn text color="primary" class="btn-undo" @click="resetName()">
        <v-icon small>mdi-undo</v-icon>
        <span>Undo</span>
      </v-btn>
    </template>

    <!-- Editing Mode -->
    <div v-else class="section-container" :class="{ 'invalid-section': invalidSection }">
      <v-row no-gutters>
        <v-col cols="12" sm="3" class="pr-4">
          <label :class="{ 'error-text': invalidSection }">
            <strong>Business Name</strong>
            <!-- *** TODO: remove before flight -->
            <div>ULC => NR 4766680</div>
            <div>BC => NR 3335087</div>
          </label>
        </v-col>

        <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
          <CorrectName
            actionTxt="restore the business"
            :correctionNameChoices="correctionNameChoices"
            :businessId="getBusinessId"
            :entityType="getEntityType"
            :nameRequest="getNameRequest"
            :companyName="companyName"
            :fetchAndValidateNr="fetchAndValidateNr"
            @saved="onSaved($event)"
            @cancel="isCorrectingName = false"
            @update:nameRequest="setNameRequest($event)"
            @update:approvedName="setNameRequestApprovedName($event)"
          />
        </v-col>
      </v-row>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, EmptyNameRequest, EntitySnapshotIF, FlagsCompanyInfoIF, NrApplicantIF,
  NameRequestIF } from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'
import { CommonMixin, DateMixin, NameRequestMixin } from '@/mixins/'
import { CoopTypes, NameChangeOptions, NrRequestActionCodes } from '@/enums/'
import { LegalServices } from '@/services/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { CorrectName } from '@bcrs-shared-components/correct-name/'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'

@Component({
  components: {
    CorrectName,
    NameRequestInfo
  },
  mixins: [
    CommonMixin,
    DateMixin,
    NameRequestMixin
  ]
})
export default class BusinessName extends Vue {
  // Global getters
  @Getter getBusinessId!: string
  @Getter getBusinessLegalName!: string
  @Getter getBusinessNumber!: string
  @Getter getEntityType!: CorpTypeCd
  @Getter getNameRequest!: NameRequestIF
  @Getter getNameRequestApprovedName!: string
  @Getter isRestorationFiling!: boolean

  @Getter getShowErrors!: boolean
  @Getter isRestorationFiling!: boolean

  // Global actions
  @Action setBusinessNameValid!: ActionBindingIF
  @Action setNameRequest!: ActionBindingIF
  @Action setNameRequestApprovedName!: ActionBindingIF

  protected dropdown: boolean = null
  protected correctNameChoices: Array<string> = []
  protected isCorrectingName = true // display options initially

  get companyName (): string {
    // *** TODO: use initial company name if it exists
    return (this.getNameRequestApprovedName || this.getBusinessLegalName)
  }

  /** This section's validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getShowErrors && this.isCorrectingName)
  }

  /** The current options for name changes. */
  get correctionNameChoices (): Array<NameChangeOptions> {
    // *** TODO: uncomment after testing
    // if (this.isRestorationFiling) {
    //   return [
    //     NameChangeOptions.CORRECT_NAME_TO_NUMBER,
    //     NameChangeOptions.CORRECT_NEW_NR
    //   ]
    // }

    // fallback case - not used for now
    return [
      NameChangeOptions.CORRECT_NAME,
      NameChangeOptions.CORRECT_NAME_TO_NUMBER,
      NameChangeOptions.CORRECT_NEW_NR
    ]
  }

  /** The request action code for this filing type. */
  get requestActionCode (): NrRequestActionCodes {
    if (this.isRestorationFiling) return NrRequestActionCodes.RESTORE
    return null
  }

  /** Whether a new business legal name was entered. */
  get isNewName (): boolean {
    console.log('*** nr approved name =', this.companyName)
    // Approved Name is null when we start
    // and is set when a name option is selected
    return !!this.getNameRequestApprovedName // *** TODO: verify intial vs updated
  }

  /** Reset company name values to original. */
  protected resetName (): void {
    // *** TODO: implement
    // // reset business information, except for association type.
    // const businessInfo = { ...this.getEntitySnapshot.businessInfo, associationType: this.getAssociationType }
    // this.setBusinessInformation(businessInfo)

    // clear out existing data
    this.setNameRequest(EmptyNameRequest)
    this.setNameRequestApprovedName(null)

    // reset flags
    this.isCorrectingName = true
  }

  /**
   * Fetches and validation a NR.
   * @param nrNum the NR number
   * @param phone the phone number to match
   * @param email the email address to match
   * @returns a promise to return the NR, or throws a printable error
   */
  protected async fetchAndValidateNr (nrNum: string, phone: string, email: string): Promise<NameRequestIF> {
    const nameRequest = await LegalServices.fetchNameRequest(nrNum)
    if (!nameRequest) throw new Error('Error fetching Name Request')

    // validateNameRequest() already throws printable errors
    return this.validateNameRequest(nameRequest, this.requestActionCode, phone, email)
  }

  /** On saved=True event, updates UI state. */
  private onSaved (saved: boolean): void {
    console.log('*** onSaved() =', saved)
    if (saved) this.isCorrectingName = false
  }

  /** Updates component validity initially and when isCorrectingName changed. */
  @Watch('isCorrectingName', { immediate: true })
  private updateComponentValidity (val: boolean): void {
    this.setBusinessNameValid(!val)
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
