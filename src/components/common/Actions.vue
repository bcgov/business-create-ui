<template>
  <div id="action-buttons-container" class="list-item pa-0">

    <div class="buttons-left">
      <v-btn
        v-if="isSummaryStep"
        id="app-summary-cancel-btn"
        large outlined
        color="primary"
        :disabled="isBusySaving"
        @click="onClickCancel()"
      >
        <span>Cancel</span>
      </v-btn>

      <v-btn
        id="save-btn"
        large outlined
        color="primary"
        :disabled="!isEntityType || isBusySaving"
        :loading="isSaving"
        @click="onClickSave()"
      >
        <span>Save</span>
      </v-btn>

      <v-btn
        id="save-resume-btn"
        large outlined
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
          id="back-btn"
          large outlined
          color="primary"
          :to="previousRoute"
          v-show="isShowBackBtn"
          :disabled="isBusySaving"
        >
          <v-icon>mdi-chevron-left</v-icon>
          <span>Back</span>
        </v-btn>
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
        <v-btn
          id="review-confirm-btn"
          large
          color="primary"
          :to="nextRoute"
          v-show="isShowReviewConfirmBtn"
          :disabled="isBusySaving"
        >
          <span class="font-weight-bold">{{ nextButtonLabel }}</span>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
        <v-btn
          id="file-pay-btn"
          large
          color="primary"
          v-show="isShowFilePayBtn"
          :loading="isFilingPaying"
          @click="onClickFilePay()"
        >
          <span>File and Pay</span>
        </v-btn>
      </v-fade-transition>

      <v-btn
        v-if="!isSummaryStep"
        id="app-cancel-btn"
        large outlined
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
import Vue from 'vue'
import { Component, Emit } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { Navigate } from '@/utils'
import { ActionBindingIF } from '@/interfaces'
import { DateMixin, FilingTemplateMixin, NameRequestMixin } from '@/mixins'
import { LegalServices } from '@/services/'
import { FilingTypes, NameRequestStates, RouteNames } from '@/enums'

@Component({
  mixins: [
    DateMixin,
    FilingTemplateMixin,
    NameRequestMixin
  ]
})
export default class Actions extends Vue {
  @Getter getEntityIdentifier!: string
  @Getter getFilingType!: string
  @Getter isApplicationValid!: boolean
  @Getter isEntityType!: boolean
  @Getter getCurrentStep!: number
  @Getter isShowReviewConfirmBtn!: boolean
  @Getter isShowFilePayBtn!: boolean
  @Getter isBusySaving!: boolean
  @Getter getSteps!: Array<any>
  @Getter getMaxStep!: number
  @Getter isSaving!: boolean
  @Getter isSavingResuming!: boolean
  @Getter isFilingPaying!: boolean
  @Getter getNameRequestNumber!: string

  @Action setIsSaving!: ActionBindingIF
  @Action setIsSavingResuming!: ActionBindingIF
  @Action setIsFilingPaying!: ActionBindingIF
  @Action setHaveChanges!: ActionBindingIF
  @Action setEffectiveDateTimeValid!: ActionBindingIF
  @Action setValidateSteps!: ActionBindingIF

  /** Is True if Jest is running the code. */
  get isJestRunning (): boolean {
    return (process.env.JEST_WORKER_ID !== undefined)
  }

  /** Is True if the Back button should be displayed. */
  get isShowBackBtn (): boolean {
    return (this.getCurrentStep > 1)
  }

  get isSummaryStep (): boolean {
    return (
      this.$route.name === RouteNames.DISSOLUTION_REVIEW_CONFIRM ||
      this.$route.name === RouteNames.INCORPORATION_REVIEW_CONFIRM ||
      this.$route.name === RouteNames.REGISTRATION_REVIEW_CONFIRM
    )
  }

  /** Called when Cancel button is clicked. */
  protected onClickCancel (): void {
    this.emitGoToDashboard()
  }

  /**
   * Called when Save button is clicked.
   * @returns a promise (ie, this is an async method)
   */
  protected async onClickSave (): Promise<void> {
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
  protected async onClickSaveResume (): Promise<void> {
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
  protected async onClickFilePay (): Promise<void> {
    // Prompt Step validations
    this.setValidateSteps(true)

    if (this.isApplicationValid) {
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

        // don't call window.scrollTo during Jest tests because jsdom doesn't implement it
        if (!this.isJestRunning) window.scrollTo({ top: 1250, behavior: 'smooth' })
        this.setIsFilingPaying(false)
        return
      }

      // If this is a named company IA, validate NR before filing submission. This method is different
      // from the processNameRequest method in App.vue. This method shows a generic message if
      // the Name Request is not valid and clicking ok in the pop up redirects to the Manage Businesses
      // dashboard.
      if (this.getNameRequestNumber) {
        try {
          await this.validateNameRequest(this.getNameRequestNumber)
        } catch (error) {
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
      // don't call window.scrollTo during Jest tests because jsdom doesn't implement it
      if (!this.isJestRunning) window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  /** Prepare filing for saving/filing. */
  private prepareFiling (): any {
    switch (this.getFilingType) {
      case FilingTypes.INCORPORATION_APPLICATION:
        return this.buildIncorporationFiling()
      case FilingTypes.REGISTRATION:
        return this.buildRegistrationFiling()
      case FilingTypes.VOLUNTARY_DISSOLUTION:
        return this.buildDissolutionFiling()
    }
  }

  /** Fetches NR and validates it. */
  private async validateNameRequest (nrNumber: string): Promise<void> {
    const nrResponse = await LegalServices.fetchNameRequest(nrNumber).catch(error => {
      this.$root.$emit('name-request-retrieve-error')
      throw new Error(error)
    })

    // ensure NR was found
    if (!nrResponse) {
      this.$root.$emit('name-request-invalid-error', NameRequestStates.INVALID)
      throw new Error('Invalid Name Request')
    }

    // ensure NR is valid
    const error = this.isNrInvalid(nrResponse)
    if (error) {
      this.$root.$emit('name-request-invalid-error', NameRequestStates.INVALID)
      throw new Error(error)
    }

    // ensure NR is consumable
    const state = this.getNrState(nrResponse)
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
    return nextStep ? nextStep.text.replace('\n', ' ') : ''
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
