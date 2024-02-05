<template>
  <v-card
    id="resulting-business-name"
    flat
  >
    <!-- Editing Mode -->
    <div
      v-if="!getCorrectNameOption && isAmalgamationFilingRegular"
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
            <strong>Resulting Business Name</strong>
          </label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="pt-4 pt-sm-0"
        >
          <CorrectName
            actionTxt="choose the resulting business name"
            :amalgamatingBusinesses="getAmalgamatingBusinesses"
            :businessId="getBusinessId"
            :companyName="companyName"
            :correctionNameChoices="correctionNameChoices"
            :entityType="null"
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
      <NameTranslations
        v-if="isAmalgamationFilingRegular"
      />

      <v-btn
        v-if="isAmalgamationFilingRegular"
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
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { AmalgamationMixin, NameRequestMixin } from '@/mixins/'
import { NameRequestIF } from '@/interfaces/'
import { LegalServices } from '@/services/'
import { CorrectNameOptions, NrRequestActionCodes } from '@bcrs-shared-components/enums/'
import { CorrectName } from '@bcrs-shared-components/correct-name/'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'
import NameTranslations from '@/components/common/NameTranslations.vue'
import { AmlTypes } from '@/enums'

@Component({
  components: {
    CorrectName,
    NameRequestInfo,
    NameTranslations
  }
})
export default class ResultingBusinessName extends Mixins(AmalgamationMixin, NameRequestMixin) {
  // @Getter(useStore) getAmalgamatingBusinesses!: Array<AmalgamatingBusinessIF>
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getBusinessLegalName!: string
  @Getter(useStore) getCorrectNameOption!: CorrectNameOptions
  @Getter(useStore) getNameRequest!: NameRequestIF
  @Getter(useStore) getNameRequestApprovedName!: string
  @Getter(useStore) getNameRequestNumber!: string
  @Getter(useStore) getShowErrors!: boolean

  // @Action(useStore) setCorrectNameOption!: (x: CorrectNameOptions) => void
  // @Action(useStore) setEntityType!: (x: CorpTypeCd) => void

  // Local properties
  formType = null as CorrectNameOptions

  readonly correctionNameChoices = [
    CorrectNameOptions.CORRECT_AML_ADOPT,
    CorrectNameOptions.CORRECT_NEW_NR,
    CorrectNameOptions.CORRECT_AML_NUMBERED
  ]

  /** The company name. */
  get companyName (): string {
    return (this.getNameRequestApprovedName || this.getBusinessLegalName)
  }

  /** This section's validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getShowErrors && !this.getCorrectNameOption)
  }

  /**
   * Fetches and validates a NR.
   * @param nrNum the NR number
   * @param businessId the business id (not used here but needed in method signature)
   * @param phone the phone number to match
   * @param email the email address to match
   * @returns a promise to return the NR, or throws a printable error
   */
  async fetchAndValidateNr (
    nrNum: string, businessId: string, phone: string, email: string
  ): Promise<NameRequestIF> {
    const nameRequest = await LegalServices.fetchValidContactNr(nrNum, phone, email)
    if (!nameRequest) throw new Error('Error fetching Name Request')

    // validateNameRequest() already throws printable errors
    return this.validateNameRequest(nameRequest, NrRequestActionCodes.AMALGAMATE)
  }

  /** On company name update, sets store accordingly. */
  onUpdateCompanyName (name: string): void {
    this.setCorrectNameOption(this.formType)
    this.setNameRequestApprovedName(name)

    // if adopting a business' name, also adopt its legal type
    if (this.formType === CorrectNameOptions.CORRECT_AML_ADOPT) {
      const business = this.getAmalgamatingBusinesses.find(b =>
        (b.type === AmlTypes.LEAR && b.name === name)
      )
      if (business?.type === AmlTypes.LEAR) {
        this.setEntityType(business.legalType)
      }
    }
  }

  /** On name request update, sets store accordingly. */
  onUpdateNameRequest (nameRequest: NameRequestIF): void {
    this.setNameRequest(nameRequest)

    // as we are using a new NR, also use its legal type
    this.setEntityType(nameRequest.legalType)
  }

  /**
   * Resets company name values to original when Cancel is clicked.
   * NB - does not reset the original legal type.
   */
  resetName (): void {
    // clear out existing data
    this.resetValues()

    // reset flag
    this.formType = null
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
