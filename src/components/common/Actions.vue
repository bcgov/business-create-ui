<template>
  <div
    id="action-buttons-container"
    class="list-item pa-0"
  >
    <div class="buttons-left">
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

      <v-btn
        id="save-btn"
        large
        outlined
        color="primary"
        :disabled="!isEntityType || isBusySaving"
        :loading="isSaving"
        @click="onClickSave()"
      >
        <span>Save</span>
      </v-btn>

      <v-btn
        id="save-resume-btn"
        large
        outlined
        color="primary"
        :disabled="!isEntityType || isBusySaving"
        :loading="isSavingResuming"
        @click="onClickSaveResume()"
      >
        <span>Save and Resume Later</span>
      </v-btn>
    </div>

    <div class="buttons-right">
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

      <v-fade-transition hide-on-leave>
        <v-btn
          v-show="isShowReviewConfirmBtn"
          id="review-confirm-btn"
          large
          color="primary"
          :to="nextRoute"
          :disabled="isBusySaving"
        >
          <span class="font-weight-bold">{{ nextButtonLabel }}</span>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
        <v-btn
          v-show="isShowFilePayBtn"
          id="file-pay-btn"
          large
          color="primary"
          :loading="isFilingPaying"
          @click="onClickFilePay()"
        >
          <span>File and Pay</span>
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
import { Navigate } from '@/utils'
import { AmalgamationMixin, CommonMixin, DateMixin, FilingTemplateMixin, NameRequestMixin } from '@/mixins'
import { LegalServices } from '@/services/'
import { FilingTypes, NameRequestStates, RouteNames } from '@/enums'

@Component({})
export default class Actions extends Mixins(AmalgamationMixin, CommonMixin,
  DateMixin, FilingTemplateMixin, NameRequestMixin) {
  @Getter(useStore) getCurrentStep!: number
  @Getter(useStore) getEntityIdentifier!: string
  @Getter(useStore) getFilingType!: string
  @Getter(useStore) getMaxStep!: number
  // @Getter(useStore) getNameRequestApplicant!: NrApplicantIF
  // @Getter(useStore) getNameRequestNumber!: string
  @Getter(useStore) getSteps!: Array<any>
  @Getter(useStore) isBusySaving!: boolean
  @Getter(useStore) isEntityType!: boolean
  @Getter(useStore) isFilingPaying!: boolean
  @Getter(useStore) isFilingValid!: boolean
  @Getter(useStore) isSaving!: boolean
  @Getter(useStore) isSavingResuming!: boolean
  @Getter(useStore) isShowFilePayBtn!: boolean
  @Getter(useStore) isShowReviewConfirmBtn!: boolean

  @Action(useStore) setEffectiveDateTimeValid!: (x: boolean) => void
  @Action(useStore) setHaveChanges!: (x: boolean) => void
  @Action(useStore) setIsFilingPaying!: (x: boolean) => void
  @Action(useStore) setIsSaving!: (x: boolean) => void
  @Action(useStore) setIsSavingResuming!: (x: boolean) => void
  @Action(useStore) setValidateSteps!: (x: boolean) => void

  /** Is True if the Back button should be displayed. */
  get isShowBackBtn (): boolean {
    return (this.getCurrentStep > 1)
  }

  get isSummaryStep (): boolean {
    return (
      this.$route.name === RouteNames.AMALG_REG_REVIEW_CONFIRM ||
      this.$route.name === RouteNames.AMALG_SHORT_REVIEW_CONFIRM ||
      this.$route.name === RouteNames.DISSOLUTION_REVIEW_CONFIRM ||
      this.$route.name === RouteNames.INCORPORATION_REVIEW_CONFIRM ||
      this.$route.name === RouteNames.REGISTRATION_REVIEW_CONFIRM ||
      this.$route.name === RouteNames.RESTORATION_REVIEW_CONFIRM
    )
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
    // Prompt Step validations
    this.setValidateSteps(true)

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
      // If File and Pay is successful setIsFilingPaying should't be reset to false,
      // this prevent buttons from being re-enabled if the page is slow to redirect.
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

      // If a NR was used, validate it before filing submission. This method is different from the
      // processNameRequest method in App.vue -- this method shows a generic message if the NR is
      // not valid and clicking OK in the pop up redirects to the Manage Businesses dashboard.
      if (this.getNameRequestNumber) {
        try {
          await this._validateNameRequest(
            this.getNameRequestNumber,
            this.getNameRequestApplicant.phoneNumber,
            this.getNameRequestApplicant.emailAddress
          )
        } catch (error) {
          console.log('Error validating NR in onClickFilePay(): ', error) // eslint-disable-line no-console
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
      if (paymentToken) {
        const isPaymentActionRequired: boolean = filingComplete.header?.isPaymentActionRequired
        const returnUrl = sessionStorage.getItem('DASHBOARD_URL') + this.getEntityIdentifier +
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
    } else {
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

  // FUTURE: merge this with NameRequestMixin::validateNameRequest()
  /** Fetches NR and validates it. */
  private async _validateNameRequest (nrNumber: string, phone = '', email = ''): Promise<void> {
    const nameRequest = await LegalServices.fetchValidContactNr(nrNumber, phone, email)
      .catch(error => {
        this.$root.$emit('name-request-retrieve-error')
        throw new Error(error)
      })

    // ensure NR was found
    if (!nameRequest) {
      this.$root.$emit('name-request-invalid-error', NameRequestStates.INVALID)
      throw new Error('Invalid Name Request')
    }

    // ensure NR is valid
    const error = this.isNrInvalid(nameRequest)
    if (error) {
      this.$root.$emit('name-request-invalid-error', NameRequestStates.INVALID)
      throw new Error(error)
    }

    // ensure NR is consumable
    const state = this.getNrState(nameRequest)
    if (state !== NameRequestStates.APPROVED && state !== NameRequestStates.CONDITIONAL) {
      this.$root.$emit('name-request-invalid-error', state || NameRequestStates.INVALID)
      throw new Error('Invalid Name request')
    }
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
    const currentStep: number | undefined = this.$router.currentRoute.meta?.step
    if (currentStep && currentStep < this.getMaxStep) {
      return this.getSteps.find(step => step.step === currentStep + 1)
    }
    return null
  }

  /** The route to the previous step. */
  get previousRoute (): string | undefined {
    const prevStep = this.prev()
    return prevStep?.to || null
  }

  /** Returns the previous step. */
  private prev (): any {
    const currentStep: number | undefined = this.$router.currentRoute.meta?.step
    if (currentStep && currentStep > 1) {
      return this.getSteps.find(step => step.step === currentStep - 1)
    }
    return null
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
