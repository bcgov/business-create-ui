<template>
  <v-container id="action-buttons-container" class="list-item">

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

  </v-container>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Emit } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { navigate } from '@/utils'

// Interfaces
import { ActionBindingIF } from '@/interfaces'

// Mixins
import { DateMixin, FilingTemplateMixin, LegalApiMixin, NameRequestMixin } from '@/mixins'

// Enums
import { FilingTypes, NameRequestStates, RouteNames } from '@/enums'

@Component({})
export default class Actions extends Mixins(DateMixin, FilingTemplateMixin, LegalApiMixin, NameRequestMixin) {
  @Getter getEntityIdentifier!: string
  @Getter getFilingType!: string
  @Getter isApplicationValid!: boolean
  @Getter isEntityType!: boolean
  @Getter isShowBackBtn!: boolean
  @Getter isShowReviewConfirmBtn!: boolean
  @Getter isShowFilePayBtn!: boolean
  @Getter isBusySaving!: boolean
  @Getter getSteps!: Array<any>
  @Getter getMaxStep!: number
  @Getter isSaving!: boolean
  @Getter isSavingResuming!: boolean
  @Getter isFilingPaying!: boolean
  @Getter isIncorporationFiling!: boolean

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

  private get isSummaryStep (): boolean {
    return (this.$route.name === RouteNames.REVIEW_CONFIRM ||
      this.$route.name === RouteNames.REVIEW_CONFIRM_DISSOLUTION)
  }

  /** Called when Cancel button is clicked. */
  private onClickCancel (): void {
    this.emitGoToDashboard()
  }

  /**
   * Called when Save button is clicked.
   * @returns a promise (ie, this is an async method)
   */
  private async onClickSave (): Promise<void> {
    // prevent double saving
    if (this.isBusySaving) return
    this.setIsSaving(true)

    try {
      const filing = await this.prepareFiling()

      // Save draft filing
      await this.updateFiling(this.getEntityIdentifier, filing, true)

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
  private async onClickSaveResume (): Promise<void> {
    // prevent double saving
    if (this.isBusySaving) return
    this.setIsSavingResuming(true)

    try {
      const filing = await this.prepareFiling()

      // Save draft filing
      await this.updateFiling(this.getEntityIdentifier, filing, true)

      // clear flag
      this.setHaveChanges(false)
    } catch (error) {
      this.$root.$emit('save-error-event', error)
      this.setIsSavingResuming(false)
      return
    }

    this.setIsSavingResuming(false)
    this.emitGoToDashboard()
  }

  /**
   * Called when File and Pay button is clicked.
   * @returns a promise (ie, this is an async method)
   */
  private async onClickFilePay (): Promise<void> {
    // Prompt Step validations
    this.setValidateSteps(true)

    if (this.isApplicationValid) {
      // prevent double saving
      if (this.isBusySaving) return
      this.setIsFilingPaying(true)

      if (
        this.getEffectiveDateTime.effectiveDate &&
        !this.isValidDateTime(this.getEffectiveDateTime.effectiveDate)
      ) {
        this.setEffectiveDateTimeValid(false)
        this.setIsFilingPaying(false)

        // don't call window.scrollTo during Jest tests because jsdom doesn't implement it
        if (!this.isJestRunning) window.scrollTo({ top: 1250, behavior: 'smooth' })
        this.setIsFilingPaying(false)
        return
      }

      // If this is a named company IA, validate NR before filing submission. This method is different
      // from the processNameRequest method in App.vue. This method shows a generic message if
      // the Name Request is not valid and clicking ok in the pop up redirects to the Manage Businesses
      // dashboard.
      if (this.isNamedBusiness) {
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
        filingComplete = await this.updateFiling(this.getEntityIdentifier, filing, false)

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
        const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')

        // if payment action is required, navigate to Pay URL
        if (isPaymentActionRequired) {
          const authUrl = sessionStorage.getItem('AUTH_WEB_URL')
          const returnUrl = encodeURIComponent(dashboardUrl + this.getEntityIdentifier)
          const payUrl = authUrl + 'makepayment/' + paymentToken + '/' + returnUrl
          // assume Pay URL is always reachable
          // otherwise user will have to retry payment later
          navigate(payUrl)
        } else {
          // navigate to Dashboard URL
          navigate(dashboardUrl + this.getEntityIdentifier)
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
      case FilingTypes.DISSOLUTION:
        return this.buildDissolutionFiling()
    }
  }

  /** Fetches NR and validates it. */
  private async validateNameRequest (nrNumber: string): Promise<void> {
    let nrResponse = await this.fetchNameRequest(nrNumber).catch(error => {
      this.$root.$emit('name-request-retrieve-error')
      throw new Error(error)
    })

    if (!nrResponse || !this.isNrValid(nrResponse)) {
      this.$root.$emit('name-request-invalid-error', NameRequestStates.INVALID)
      throw new Error('Invalid Name Request')
    }

    // ensure NR is consumable
    const state = this.getNrState(nrResponse)
    if (state !== NameRequestStates.APPROVED && state !== NameRequestStates.CONDITIONAL) {
      this.$root.$emit('name-request-invalid-error', state || NameRequestStates.INVALID)
      throw new Error('Invalid Name request')
    }
  }

  /** The route to the next step. */
  private get nextRoute (): string | undefined {
    const nextStep = this.next()
    return nextStep?.to || null
  }

  /** Label for the Next button. */
  private get nextButtonLabel (): string {
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
  private get previousRoute (): string | undefined {
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
  private emitGoToDashboard (): void { }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#action-buttons-container {
  background-color: $gray1;
  padding-top: 2rem;
  padding-bottom: 2rem;
  border-top: 1px solid $gray5;

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
