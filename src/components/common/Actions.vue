<template>
  <v-container id="action-buttons-container" class="list-item">

    <div class="buttons-left">
      <v-btn id="save-btn" large
        :disabled="!isEntityType || isBusySaving"
        :loading="stateModel.isSaving"
        @click="onClickSave()"
      >
        <span>Save</span>
      </v-btn>

      <v-btn id="save-resume-btn" large
        :disabled="!isEntityType || isBusySaving"
        :loading="stateModel.isSavingResuming"
        @click="onClickSaveResume()"
      >
        <span>Save and Resume Later</span>
      </v-btn>
    </div>

    <div class="buttons-right">
      <v-fade-transition hide-on-leave>
        <v-btn id="back-btn" large outlined
          :to="previousRoute"
          v-show="isShowBackBtn"
          :disabled="isBusySaving"
        >
          <v-icon>mdi-chevron-left</v-icon>
          <span>Back</span>
        </v-btn>
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
        <v-btn id="review-confirm-btn" large color="primary"
          :to="nextRoute"
          v-show="isShowReviewConfirmBtn"
          :disabled="isBusySaving"
        >
          <span>{{ nextButtonLabel }}</span>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
        <v-btn id="file-pay-btn" large color="primary"
          v-show="isShowFilePayBtn"
          :loading="stateModel.isFilingPaying"
          @click="onClickFilePay()"
        >
          <span>File and Pay</span>
        </v-btn>
      </v-fade-transition>

      <v-btn id="app-cancel-btn" large
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
import { State, Getter, Action } from 'vuex-class'

// Interfaces
import { StateModelIF, GetterIF, ActionBindingIF } from '@/interfaces'

// Mixins
import { DateMixin, FilingTemplateMixin, LegalApiMixin, NameRequestMixin } from '@/mixins'

// Enums
import { NameRequestStates } from '@/enums'

@Component({})
export default class Actions extends Mixins(DateMixin, FilingTemplateMixin, LegalApiMixin, NameRequestMixin) {
  // Global state
  @State stateModel!: StateModelIF

  @State(state => state.stateModel.incorporationDateTime.effectiveDate)
  readonly effectiveDate!: Date

  // Global getters
  @Getter isEntityType!: GetterIF
  @Getter isShowBackBtn!: GetterIF
  @Getter isShowReviewConfirmBtn!: GetterIF
  @Getter isShowFilePayBtn!: GetterIF
  @Getter isEnableFilePay!: GetterIF
  @Getter isBusySaving!: GetterIF
  @Getter getSteps!: Array<any>
  @Getter getMaxStep!: number
  @Getter isNamedBusiness!: boolean
  @Getter getNameRequestNumber!: string

  // Global actions
  @Action setIsSaving!: ActionBindingIF
  @Action setIsSavingResuming!: ActionBindingIF
  @Action setIsFilingPaying!: ActionBindingIF
  @Action setHaveChanges!: ActionBindingIF
  @Action setIsIncorporationDateTimeValid!: ActionBindingIF
  @Action setValidateSteps!: ActionBindingIF

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

    let filingComplete: any
    try {
      const filing = await this.buildFiling()
      filingComplete = await this.updateFiling(filing, true)
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

    let filingComplete: any
    try {
      const filing = await this.buildFiling()
      filingComplete = await this.updateFiling(filing, true)
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

    if (this.isEnableFilePay) {
      // prevent double saving
      if (this.isBusySaving) return
      this.setIsFilingPaying(true)

      if (this.effectiveDate && !this.isValidDateTime(this.effectiveDate)) {
        this.setIsIncorporationDateTimeValid(false)
        this.setIsFilingPaying(false)
        window.scrollTo({ top: 1250, behavior: 'smooth' })
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
        const filing = await this.buildFiling()
        filingComplete = await this.updateFiling(filing, false)
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

        // if payment action is required, redirect to Pay URL
        if (isPaymentActionRequired) {
          const authUrl = sessionStorage.getItem('AUTH_WEB_URL')
          const returnUrl = encodeURIComponent(dashboardUrl + this.getTempId)
          const payUrl = authUrl + 'makepayment/' + paymentToken + '/' + returnUrl
          // assume Pay URL is always reachable
          // otherwise user will have to retry payment later
          window.location.assign(payUrl)
        } else {
          // redirect to Dashboard URL
          window.location.assign(dashboardUrl + this.getTempId)
        }
      } else {
        const error = new Error('Missing Payment Token')
        this.$root.$emit('save-error-event', error)
        this.setIsFilingPaying(false)
      }
    } else window.scrollTo({ top: 0, behavior: 'smooth' })
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
}
</style>
