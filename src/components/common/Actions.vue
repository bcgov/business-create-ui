<template>
  <v-container id="action-buttons-container" class="list-item">

    <div class="buttons-left">
      <v-btn id="save-btn" large
        :disabled="!isEntityType || isBusySaving"
        :loading="stateModel.isSaving"
        @click="onClickSave()">
        <span>Save</span>
      </v-btn>

      <v-btn id="save-resume-btn" large
        :disabled="!isEntityType || isBusySaving"
        :loading="stateModel.isSavingResuming"
        @click="onClickSaveResume()">
        <span>Save and Resume Later</span>
      </v-btn>
    </div>

    <div class="buttons-right">
      <v-fade-transition hide-on-leave>
        <v-btn id="back-btn" large outlined
          :to="previousRoute"
          v-show="isShowBackBtn"
          :disabled="isBusySaving">
          <v-icon>mdi-chevron-left</v-icon>
          <span>Back</span>
        </v-btn>
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
        <v-btn id="review-confirm-btn" large color="primary"
          :to="nextRoute"
          v-show="isShowReviewConfirmBtn"
          :disabled="isBusySaving">
          <span>{{ nextButtonLabel }}</span>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
        <v-btn id="file-pay-btn" large color="primary"
          v-show="isShowFilePayBtn"
          :disabled="!isEnableFilePayBtn || isBusySaving"
          :loading="stateModel.isFilingPaying"
          @click="onClickFilePay()">
          <span>File and Pay</span>
        </v-btn>
      </v-fade-transition>

      <v-btn id="cancels-btn" large
        :disabled="isBusySaving"
        @click="onCancel()">
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

  // Global actions
  @Action setIsSaving!: ActionBindingIF
  @Action setIsSavingResuming!: ActionBindingIF
  @Action setIsFilingPaying!: ActionBindingIF

  // Local Properties
  private authUrl = sessionStorage.getItem('AUTH_URL') || ''

  /**
   * Method called when Cancel button is clicked.
   */
  private onCancel (): void {
    // assume Auth URL is always reachable
    window.location.assign(this.authUrl)
  }

  /**
   * Method called when Save button is clicked.
   * @returns A promise (ie, this is an async method).
   */
  private async onClickSave (): Promise<void> {
    this.setIsSaving(true)
    try {
      const filing = await this.buildFiling()
      await this.saveFiling(filing, true)
    } catch (e) {
      // TODO:  Trigger some error dialog. Will catch any errors from the Api calls
    }
    this.setIsSaving(false)
  }

  /**
   * Method called when Save and Resume button is clicked.
   * @returns A promise (ie, this is an async method).
   */
  private async onClickSaveResume (): Promise<void> {
    this.setIsSavingResuming(true)
    try {
      const filing = await this.buildFiling()
      await this.saveFiling(filing, true)
    } catch (e) {
      // TODO:  Trigger some error dialog. Will catch any errors from the Api calls
    }
    this.setIsSavingResuming(false)
    window.location.assign(this.authUrl)
  }

  /**
   * Method called when File and Pay button is clicked.
   * @returns A promise (ie, this is an async method).
   */
  private async onClickFilePay (): Promise<void> {
    this.setIsFilingPaying(true)
    try {
      const filing = await this.buildFiling()
      await this.saveFiling(filing, false)
    } catch (e) {
      // TODO:  Trigger some error dialog. Will catch any errors from the Api calls
    }
    this.setIsFilingPaying(false)
  }

  private get nextRoute (): string | null {
    const nextStep = this.next()
    if (nextStep) {
      return nextStep.to
    }
    return null
  }

  private get nextButtonLabel (): string {
    const nextStep = this.next()
    if (nextStep) {
      return nextStep.text.replace('\n', ' ')
    }
    return ''
  }

  private next () : any {
    const currentStep: number| null = this.$router.currentRoute.meta?.step
    if (currentStep && currentStep < this.stateModel.maxStep) {
      return this.getSteps.find(step => step.step === currentStep + 1)
    }
    return null
  }

  private get previousRoute (): string | null {
    const currentStep: number| null = this.$router.currentRoute.meta?.step
    if (currentStep && currentStep > this.stateModel.minStep) {
      const previous = this.getSteps.find(step => step.step === currentStep - 1)
      if (previous) {
        return previous.to
      }
    }
    return null
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
