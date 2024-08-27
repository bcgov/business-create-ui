<template>
  <div id="resulting-business-name">
    <NameRequestErrorDialog
      attach="#resulting-business-name"
      :dialog="nameRequestErrorDialog"
      :error="nameRequestError"
      @okay="nameRequestErrorDialog = false"
    />

    <v-card flat>
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
              :amalgamatingBusinesses="amalgamatingBusinesses"
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
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { StatusCodes } from 'http-status-codes'
import { useStore } from '@/store/store'
import { AmlTypes } from '@/enums'
import { AmalgamationMixin, NameRequestMixin } from '@/mixins/'
import { AmalgamatingBusinessIF, NameRequestIF } from '@/interfaces/'
import { LegalServices } from '@/services/'
import { CorrectNameOptions, NrRequestActionCodes } from '@bcrs-shared-components/enums/'
import { CorrectName } from '@bcrs-shared-components/correct-name/'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'
import NameTranslations from '@/components/common/NameTranslations.vue'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { NameRequestErrorDialog } from '@/dialogs/'

@Component({
  components: {
    CorrectName,
    NameRequestErrorDialog,
    NameRequestInfo,
    NameTranslations
  }
})
export default class ResultingBusinessName extends Mixins(AmalgamationMixin, NameRequestMixin) {
  // @Getter(useStore) getAmalgamatingBusinesses!: Array<AmalgamatingBusinessIF>
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getBusinessLegalName!: string
  @Getter(useStore) getCorrectNameOption!: CorrectNameOptions
  // @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getNameRequest!: NameRequestIF
  @Getter(useStore) getNameRequestApprovedName!: string
  @Getter(useStore) getNameRequestNumber!: string
  @Getter(useStore) getShowErrors!: boolean

  // @Action(useStore) setCorrectNameOption!: (x: CorrectNameOptions) => void
  // @Action(useStore) setEntityType!: (x: CorpTypeCd) => void

  // Local properties
  formType = null as CorrectNameOptions
  nameRequestErrorDialog = false
  nameRequestError = ''

  readonly correctionNameChoices = [
    CorrectNameOptions.CORRECT_AML_ADOPT,
    CorrectNameOptions.CORRECT_NEW_NR,
    CorrectNameOptions.CORRECT_AML_NUMBERED
  ]

  /**
   * The list of amalgamating businesses, excluding foreigns and including only businesses of a
   * compatible entity type: ULC to ULC, LTD to LTD, and CCC to CCC.
   */
  get amalgamatingBusinesses (): AmalgamatingBusinessIF[] {
    const ULCs = [CorpTypeCd.BC_ULC_COMPANY, CorpTypeCd.ULC_CONTINUE_IN]
    const LTDs = [CorpTypeCd.BC_COMPANY, CorpTypeCd.CONTINUE_IN, CorpTypeCd.BENEFIT_COMPANY,
      CorpTypeCd.BEN_CONTINUE_IN]
    const CCCs = [CorpTypeCd.BC_CCC, CorpTypeCd.CCC_CONTINUE_IN]

    return this.getAmalgamatingBusinesses.filter(business =>
      (business.type !== AmlTypes.FOREIGN) &&
      (
        // check if entity types match exactly
        (this.getEntityType === business.legalType) ||
        // allow ULCs and CULs to match
        (ULCs.includes(this.getEntityType) && ULCs.includes(business.legalType)) ||
        // allow BC/Cs and BEN/CBENs to match
        (LTDs.includes(this.getEntityType) && LTDs.includes(business.legalType)) ||
        // allow CCs and CCCs to match
        (CCCs.includes(this.getEntityType) && CCCs.includes(business.legalType))
      )
    )
  }

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
    return this.validateNameRequest(nameRequest, NrRequestActionCodes.AMALGAMATE, null, phone, email,
      this.getEntityType)
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

    // if adopting a business' name, also adopt its legal type
    // and update resources (since legal type may have changed)
    if (this.formType === CorrectNameOptions.CORRECT_AML_ADOPT) {
      const business = this.getAmalgamatingBusinesses.find(b =>
        (b.type === AmlTypes.LEAR && b.name === name)
      )
      if (business?.type === AmlTypes.LEAR) {
        this.setEntityType(this.getLegalType(business.legalType))
        this.updateResources()
      }
    }
  }

  /** On name request update, sets store accordingly. */
  onUpdateNameRequest (nameRequest: NameRequestIF): void {
    this.setNameRequest(nameRequest)

    // as we are using a new NR, also use its legal type
    // and update resources (since legal type may have changed)
    this.setEntityType(this.getLegalType(nameRequest.legalType))
    this.updateResources()
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
