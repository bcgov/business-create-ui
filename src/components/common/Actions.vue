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
          to="/define-company"
          v-show="isShowBackBtn"
          :disabled="isBusySaving"
        >
          <v-icon>mdi-chevron-left</v-icon>
          <span>Back</span>
        </v-btn>
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
        <v-btn id="review-confirm-btn" large color="primary"
          to="/review-confirm"
          v-show="isShowReviewConfirmBtn"
          :disabled="isBusySaving"
        >
          <span>Review and Confirm</span>
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
        @click="onCancel()"
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
import { ApiMixin } from '@/mixins'

@Component
export default class Actions extends Mixins(ApiMixin) {
  // Global state
  @State stateModel!: StateModelIF

  // Global getters
  @Getter isEntityType!: GetterIF
  @Getter isShowBackBtn!: GetterIF
  @Getter isShowReviewConfirmBtn!: GetterIF
  @Getter isShowFilePayBtn!: GetterIF
  @Getter isEnableFilePayBtn!: GetterIF
  @Getter isBusySaving!: GetterIF

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
    await this.saveFiling(true)
    this.setIsSaving(false)
  }

  /**
   * Method called when Save and Resume button is clicked.
   * @returns A promise (ie, this is an async method).
   */
  private async onClickSaveResume (): Promise<void> {
    this.setIsSavingResuming(true)
    await this.saveFiling(true)
    this.setIsSavingResuming(false)
    window.location.assign(this.authUrl)
  }

  /**
   * Method called when File and Pay button is clicked.
   * @returns A promise (ie, this is an async method).
   */
  private async onClickFilePay (): Promise<void> {
    this.setIsFilingPaying(true)
    await this.saveFiling(false)
    this.setIsFilingPaying(false)
  }

  /**
   * Method that "sleeps" for specified timeout. Must be called from async method.
   * @param ms Delay to sleep, in milliseconds.
   * @returns A promise to await upon.
   */
  private sleep (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
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
