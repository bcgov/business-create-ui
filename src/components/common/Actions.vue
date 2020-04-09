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
          :disabled="!isEnableFilePayBtn || isBusySaving"
          :loading="stateModel.isFilingPaying"
          @click="onClickFilePay()"
        >
          <span>File and Pay</span>
        </v-btn>
      </v-fade-transition>

      <v-btn id="cancels-btn" large
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
import { Component, Mixins } from 'vue-property-decorator'
import { State, Getter, Action } from 'vuex-class'

// Interfaces
import { StateModelIF, GetterIF, ActionBindingIF } from '@/interfaces'

// Mixins
import { FilingTemplateMixin, LegalApiMixin } from '@/mixins'

@Component
export default class Actions extends Mixins(FilingTemplateMixin, LegalApiMixin) {
  // Global state
  @State stateModel!: StateModelIF

  // Global getters
  @Getter isEntityType!: GetterIF
  @Getter isShowBackBtn!: GetterIF
  @Getter isShowReviewConfirmBtn!: GetterIF
  @Getter isShowFilePayBtn!: GetterIF
  @Getter isEnableFilePayBtn!: GetterIF
  @Getter isBusySaving!: GetterIF
  @Getter getSteps!: Array<any>
  @Getter getMaxStep!: number

  // Global actions
  @Action setIsSaving!: ActionBindingIF
  @Action setIsSavingResuming!: ActionBindingIF
  @Action setIsFilingPaying!: ActionBindingIF

  /** The URL to the Authentication site. */
  private get authUrl (): string {
    return sessionStorage.getItem('AUTH_URL')
  }

  /** The URL to the Business Dashboard. */
  private get dashboardUrl (): string {
    return sessionStorage.getItem('DASHBOARD_URL')
  }

  /** Called when Cancel button is clicked. */
  private onClickCancel (): void {
    // FUTURE: need check for unsaved data
    this.redirectToDashboard()
  }

  /**
   * Called when Save button is clicked.
   * @returns a promise (ie, this is an async method)
   */
  private async onClickSave (): Promise<void> {
    // prevent double saving
    if (this.isBusySaving) return

    this.setIsSaving(true)
    let filingComplete

    try {
      const filing = await this.buildFiling()
      filingComplete = await this.saveFiling(filing, true)
    } catch (e) {
      // TODO: Trigger some error dialog. Will catch any errors from the API calls.
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
    let filingComplete

    try {
      const filing = await this.buildFiling()
      filingComplete = await this.saveFiling(filing, true)
    } catch (e) {
      // TODO: Trigger some error dialog. Will catch any errors from the API calls.
    }

    this.setIsSavingResuming(false)
    this.redirectToDashboard()
  }

  /**
   * Called when File and Pay button is clicked.
   * @returns a promise (ie, this is an async method)
   */
  private async onClickFilePay (): Promise<void> {
    // prevent double saving
    if (this.isBusySaving) return

    this.setIsFilingPaying(true)
    let filingComplete

    try {
      const filing = await this.buildFiling()
      filingComplete = await this.saveFiling(filing, false)
    } catch (e) {
      // TODO: Trigger some error dialog. Will catch any errors from the API calls.
    }

    this.setIsFilingPaying(false)

    const paymentToken = filingComplete?.header?.paymentToken
    if (paymentToken) {
      const queryNrNumber = this.$route.query.nrNumber as string
      const returnURL = encodeURIComponent(this.dashboardUrl + queryNrNumber)
      const payURL = this.authUrl + 'makepayment/' + paymentToken + '/' + returnURL

      // assume Pay URL is always reachable
      // otherwise user will have to retry payment later
      window.location.assign(payURL)
    } else {
      // TODO: Trigger some error dialog.
    }
  }

  // TODO: should this be a getter or a function?
  /** Route to next step. */
  private get nextRoute (): string | undefined {
    const nextStep = this.next()
    return nextStep?.to || null
  }

  /** Label for Next button. */
  private get nextButtonLabel (): string {
    const nextStep = this.next()
    return nextStep ? nextStep.text.replace('\n', ' ') : ''
  }

  /** Returns next step. */
  private next (): any {
    const currentStep: number | undefined = this.$router.currentRoute.meta?.step
    if (currentStep && currentStep < this.getMaxStep) {
      return this.getSteps.find(step => step.step === currentStep + 1)
    }
    return null
  }

  /** Route to previous step. */
  private get previousRoute (): string | undefined {
    const prevStep = this.prev()
    return prevStep?.to || null
  }

  /** Returns previous step. */
  private prev (): any {
    const currentStep: number | undefined = this.$router.currentRoute.meta?.step
    if (currentStep && currentStep > 1) {
      return this.getSteps.find(step => step.step === currentStep - 1)
    }
    return null
  }

  /** Redirects to dashboard URL. */
  private redirectToDashboard (): void {
    const queryNrNumber = this.$route.query.nrNumber as string
    window.location.assign(this.dashboardUrl + queryNrNumber)
  }
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
