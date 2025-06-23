<template>
  <div
    id="action-buttons-container"
    class="list-item pa-0"
  >
    <div class="buttons-left">
      <!-- Cancel -->
      <v-btn
        v-if="isSummaryStep"
        id="app-summary-cancel-btn"
        large
        outlined
        color="primary"
        :disabled="isBusySaving"
        @click="onClickCancel()"
      >
        <span>Cancel</span>
      </v-btn>

      <!-- Save -->
      <v-btn
        id="save-btn"
        large
        outlined
        color="primary"
        :disabled="!isEntityType || isBusySaving || !IsAuthorized(AuthorizedActions.SAVE_DRAFT)"
        :loading="isSaving"
        @click="onClickSave()"
      >
        <span>Save</span>
      </v-btn>

      <!-- Save and Resume later -->
      <v-btn
        id="save-resume-btn"
        large
        outlined
        color="primary"
        :disabled="!isEntityType || isBusySaving || !IsAuthorized(AuthorizedActions.SAVE_DRAFT)"
        :loading="isSavingResuming"
        @click="onClickSaveResume()"
      >
        <span>Save and Resume Later</span>
      </v-btn>
    </div>

    <div class="buttons-right">
      <!-- Back -->
      <v-fade-transition hide-on-leave>
        <v-btn
          v-show="isShowBackBtn"
          id="back-btn"
          large
          outlined
          color="primary"
          :to="previousRoute"
          :disabled="isBusySaving"
        >
          <v-icon>mdi-chevron-left</v-icon>
          <span>Back</span>
        </v-btn>
      </v-fade-transition>

      <!-- "next" -->
      <v-fade-transition hide-on-leave>
        <v-btn
          v-show="isShowNextBtn"
          id="next-btn"
          large
          color="primary"
          :to="nextRoute"
          :disabled="isBusySaving"
        >
          <span class="font-weight-bold">{{ nextButtonLabel }}</span>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-fade-transition>

      <!-- File and Pay -->
      <v-fade-transition hide-on-leave>
        <v-btn
          v-show="isShowFilePayBtn"
          id="file-pay-btn"
          large
          color="primary"
          :loading="isFilingPaying"
          :disabled="!IsAuthorized(AuthorizedActions.FILE_AND_PAY)"
          @click="onClickFilePay()"
        >
          <span>{{ filePayButtonLabel }}</span>
        </v-btn>
      </v-fade-transition>

      <v-btn
        v-if="!isSummaryStep"
        id="app-cancel-btn"
        large
        outlined
        color="primary"
        :disabled="isBusySaving"
        @click="onClickCancel()"
      >
        <span>Cancel</span>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins } from 'vue-property-decorator'
import { Getter, Action } from 'pinia-class'
import { useStore } from '@/store/store'
import { IsAuthorized, Navigate } from '@/utils'
import { AmalgamationMixin, CommonMixin, DateMixin, FilingTemplateMixin, NameRequestMixin }
  from '@/mixins'
import { LegalServices } from '@/services/'
import { AuthorizedActions, FilingStatus, FilingTypes, RouteNames } from '@/enums'
import { NameRequestStates } from '@bcrs-shared-components/enums'
import flushPromises from 'flush-promises'

@Component({})
export default class Actions extends Mixins(
  AmalgamationMixin, CommonMixin, DateMixin, FilingTemplateMixin, NameRequestMixin
) {
  // for template
  readonly AuthorizedActions = AuthorizedActions
  readonly IsAuthorized = IsAuthorized

  @Getter(useStore) getCurrentStep!: number
  @Getter(useStore) getEntityIdentifier!: string
  @Getter(useStore) getFilingStatus!: FilingStatus
  @Getter(useStore) getFilingType!: string
  @Getter(useStore) getMaxStep!: number
  // @Getter(useStore) getNameRequestApplicant!: NrApplicantIF
  // @Getter(useStore) getNameRequestNumber!: string
  @Getter(useStore) getSteps!: Array<any>
  @Getter(useStore) isBusySaving!: boolean
  // @Getter(useStore) isContinuationInAuthorization!: boolean
  @Getter(useStore) isContinuationInFiling!: boolean
  @Getter(useStore) isEntityType!: boolean
  @Getter(useStore) isFilingPaying!: boolean
  @Getter(useStore) isFilingValid!: boolean
  @Getter(useStore) isSaving!: boolean
  @Getter(useStore) isSavingResuming!: boolean
  @Getter(useStore) isShowFilePayBtn!: boolean
  @Getter(useStore) isShowNextBtn!: boolean

  @Action(useStore) setEffectiveDateTimeValid!: (x: boolean) => void
  @Action(useStore) setHaveChanges!: (x: boolean) => void
  @Action(useStore) setIsFilingPaying!: (x: boolean) => void
  @Action(useStore) setIsSaving!: (x: boolean) => void
  @Action(useStore) setIsSavingResuming!: (x: boolean) => void
  @Action(useStore) setValidateSteps!: (x: boolean) => void

  /** Whether the Back button should be displayed. */
  get isShowBackBtn (): boolean {
    return (this.getCurrentStep > 1)
  }

  /** Whether this is a filing summary step. */
  get isSummaryStep (): boolean {
    return (
      this.$route.name === RouteNames.AMALG_REG_REVIEW_CONFIRM ||
      this.$route.name === RouteNames.AMALG_SHORT_REVIEW_CONFIRM ||
      this.$route.name === RouteNames.CONTINUATION_IN_REVIEW_CONFIRM ||
      this.$route.name === RouteNames.DISSOLUTION_REVIEW_CONFIRM ||
      this.$route.name === RouteNames.INCORPORATION_REVIEW_CONFIRM ||
      this.$route.name === RouteNames.REGISTRATION_REVIEW_CONFIRM ||
      this.$route.name === RouteNames.RESTORATION_REVIEW_CONFIRM
    )
  }

  /** The route to the previous step. */
  get previousRoute (): string {
    const prevStep = this.prev()
    return prevStep?.to || null
  }

  /** Returns the previous step. */
  private prev (): any {
    const currentStep: number = this.$router.currentRoute.meta?.step
    if (currentStep && currentStep > 1) {
      return this.getSteps.find(step => step.step === currentStep - 1)
    }
    return null
  }

  /** The route to the next step. */
  get nextRoute (): string | undefined {
    const nextStep = this.next()
    return nextStep?.to || null
  }

  /** Label for the Next button. */
  get nextButtonLabel (): string {
    const nextStep = this.next()
    return nextStep ? nextStep.text.replaceAll('\n', ' ') : ''
  }

  /** Returns the next step. */
  private next (): any {
    const currentStep: number = this.$router.currentRoute.meta?.step
    if (currentStep && currentStep < this.getMaxStep) {
      return this.getSteps.find(step => step.step === currentStep + 1)
    }
    return null
  }

  /** Label for the File and Pay button. */
  get filePayButtonLabel (): string {
    // special case for Continuation In Authorizations
    if (this.isContinuationInFiling && (this.getFilingStatus === FilingStatus.DRAFT)) {
      return 'Submit'
    }
    // special case for Continuation In Authorizations
    if (this.isContinuationInFiling && (this.getFilingStatus === FilingStatus.CHANGE_REQUESTED)) {
      return 'Resubmit'
    }
    return 'File and Pay'
  }

  /** Called when Cancel button is clicked. */
  onClickCancel (): void {
    this.emitGoToDashboard()
  }

  /**
   * Called when Save button is clicked.
   * @returns a promise (ie, this is an async method)
   */
  async onClickSave (): Promise<void> {
    // prevent double saving
    if (this.isBusySaving) return
    this.setIsSaving(true)

    try {
      const filing = await this.prepareFiling()

      // Save draft filing
      await LegalServices.updateFiling(this.getEntityIdentifier, filing, true)

      // clear flag
      this.setHaveChanges(false)
    } catch (error) {
      console.log('Error on onClickSave(): ', error) // eslint-disable-line no-console
      this.$root.$emit('save-error-event', error)
      this.setIsSaving(false)
      return
    }

    this.setIsSaving(false)
  }

  /**
   * Called when Save and Resume Later button is clicked.
   * @returns a promise (ie, this is an async method)
   */
  async onClickSaveResume (): Promise<void> {
    // prevent double saving
    if (this.isBusySaving) return
    // If Save and Resume is successful setIsFilingPaying should't be reset to false,
    // this prevent buttons from being re-enabled if the page is slow to redirect.
    this.setIsSavingResuming(true)

    try {
      const filing = await this.prepareFiling()

      // Save draft filing
      await LegalServices.updateFiling(this.getEntityIdentifier, filing, true)

      // clear flag
      this.setHaveChanges(false)
    } catch (error) {
      console.log('Error on onClickSaveResume(): ', error) // eslint-disable-line no-console
      this.$root.$emit('save-error-event', error)
      this.setIsSavingResuming(false)
      return
    }

    this.emitGoToDashboard()
  }

  /**
   * Called when File and Pay button is clicked.
   * @returns a promise (ie, this is an async method)
   */
  async onClickFilePay (): Promise<void> {
    // prompt step validations
    this.setValidateSteps(true)

    // wait extra long for Continuation In Authorization to validate
    // (whereas regular filings validate when getShowErrors becomes True)
    if (this.isContinuationInAuthorization) await flushPromises()

    if (this.getFilingType === FilingTypes.AMALGAMATION_APPLICATION) {
      try {
        // Re-fetch the business table data. We do this in case one of the businesses has changed (eg,
        // became historical) while the draft was open.
        const holdingPrimary = await this.refetchAmalgamatingBusinessesInfo()

        // If there's a holding or primary business, re-fetch its data and update the prepopulated data.
        // This will overwrite office addresses, directors, share structure, legal name and legal type.
        if (holdingPrimary) await this.updatePrepopulatedData(holdingPrimary)
      } catch (error) {
        console.log('Error validating table in onClickFilePay(): ', error) // eslint-disable-line no-console
        this.setIsFilingPaying(false)
        return
      }
    }

    if (this.isFilingValid) {
      // prevent double saving
      if (this.isBusySaving) return
      // If File and Pay is successful, setIsFilingPaying shouldn't be reset to false.
      // This prevent buttons from being re-enabled if the page is slow to redirect.
      this.setIsFilingPaying(true)

      if (
        this.getEffectiveDateTime.effectiveDate &&
        !this.isValidDateTime(this.getEffectiveDateTime.effectiveDate)
      ) {
        this.setEffectiveDateTimeValid(false)

        window.scrollTo({ top: 1250, behavior: 'smooth' })
        this.setIsFilingPaying(false)
        return
      }

      // If a NR was used, validate it before filing submission.
      if (this.getNameRequestNumber) {
        try {
          await this._validateNameRequest(
            this.getNameRequestNumber,
            this.getNameRequestApplicant.phoneNumber,
            this.getNameRequestApplicant.emailAddress
          )
        } catch (error) {
          console.log('Error validating NR in onClickFilePay():', error) // eslint-disable-line no-console
          this.setIsFilingPaying(false)
          return
        }
      }

      let filingComplete: any
      try {
        const filing = await this.prepareFiling()

        // Save filing
        filingComplete = await LegalServices.updateFiling(this.getEntityIdentifier, filing, false)

        // clear flag
        this.setHaveChanges(false)
      } catch (error) {
        console.log('Error updating filing in onClickFilePay(): ', error) // eslint-disable-line no-console
        this.$root.$emit('save-error-event', error)
        this.setIsFilingPaying(false)
        return
      }

      const paymentToken = filingComplete?.header?.paymentToken
      // special case for continuation in authorization -- no payment at this time
      if (paymentToken || this.isContinuationInAuthorization) {
        const isPaymentActionRequired: boolean = filingComplete.header?.isPaymentActionRequired
        const returnUrl = sessionStorage.getItem('BUSINESS_DASH_URL') + this.getEntityIdentifier +
          `?filing_id=${this.getFilingId}`

        // if payment action is required, navigate to Pay URL
        if (isPaymentActionRequired) {
          const authUrl = sessionStorage.getItem('AUTH_WEB_URL')
          const payUrl = authUrl + 'makepayment/' + paymentToken + '/' + encodeURIComponent(returnUrl)
          // assume Pay URL is always reachable
          // otherwise user will have to retry payment later
          Navigate(payUrl)
        } else {
          // navigate to Dashboard URL
          Navigate(returnUrl)
        }
      } else {
        const error = new Error('Missing Payment Token')
        this.$root.$emit('save-error-event', error)
        this.setIsFilingPaying(false)
      }
    } else if (!this.isContinuationInAuthorization) {
      // if this is a Continuation In Authorization then let that page scroll if needed
      // otherwise, smooth-scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  /** Prepare filing for saving/filing. */
  private prepareFiling (): any {
    switch (this.getFilingType) {
      case FilingTypes.AMALGAMATION_APPLICATION:
        return this.buildAmalgamationFiling()
      case FilingTypes.CONTINUATION_IN:
        return this.buildContinuationInFiling()
      case FilingTypes.INCORPORATION_APPLICATION:
        return this.buildIncorporationFiling()
      case FilingTypes.REGISTRATION:
        return this.buildRegistrationFiling()
      case FilingTypes.RESTORATION:
        return this.buildRestorationFiling()
      case FilingTypes.DISSOLUTION:
        return this.buildDissolutionFiling()
    }
  }

  /**
   * Fetches NR and validates it.
   * This method is different from processNameRequest() in App.vue -- it checks fewer things.
   * On error, this method emits an event that displays one of two dialogs.
   */
  private async _validateNameRequest (nrNumber: string, phone = '', email = ''): Promise<void> {
    const nameRequest = await LegalServices.fetchNameRequest(nrNumber, phone, email)
      .catch(error => {
        this.$root.$emit('name-request-retrieve-error')
        throw new Error(`NR fetch error = ${error}`)
      })

    // ensure NR is still valid (safety check)
    const invalid = this.isNrInvalid(nameRequest)
    if (invalid) {
      this.$root.$emit('name-request-invalid-error', NameRequestStates.INVALID)
      throw new Error(`Invalid NR data = ${invalid}`)
    }

    // ensure NR is still consumable
    const state = this.getNrState(nameRequest)
    if (state !== NameRequestStates.APPROVED && state !== NameRequestStates.CONDITIONAL) {
      this.$root.$emit('name-request-invalid-error', state || NameRequestStates.INVALID)
      throw new Error(`Invalid NR state = {$state}`)
    }
  }

  /** Emits Go To Dashboard event. */
  @Emit('goToDashboard')
  private emitGoToDashboard (): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#action-buttons-container {
  background-color: $BCgovInputBG;

  .buttons-left {
    width: 50%;
  }

  .buttons-right {
    margin-left: auto;
  }

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }

  .v-icon {
    margin-top: 1px;

    &.mdi-chevron-left {
      margin-left: -8px;
    }

    &.mdi-chevron-right {
      margin-right: -8px;
    }
  }
}
</style>
